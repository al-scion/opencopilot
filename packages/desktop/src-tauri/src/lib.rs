mod window_customizer;
use std::{
    net::{SocketAddr, TcpListener, TcpStream},
    sync::{Arc, Mutex},
    time::{Duration, Instant},
};
use tauri::{
    path::BaseDirectory, AppHandle, Manager, RunEvent, State, WebviewUrl, WebviewWindow,
};
use tauri_plugin_shell::process::{CommandChild, CommandEvent};
use tauri_plugin_shell::ShellExt;

use crate::window_customizer::PinchZoomDisablePlugin;

#[derive(Clone)]
struct ServerState {
    child: Arc<Mutex<Option<CommandChild>>>,
    port: u32,
}

impl ServerState {
    pub fn new(
        child: Option<CommandChild>,
        port: u32,
    ) -> Self {
        Self {
            child: Arc::new(Mutex::new(child)),
            port,
        }
    }
    
    pub fn set_child(&self, child: Option<CommandChild>) {
        *self.child.lock().unwrap() = child;
    }
}

#[tauri::command]
fn kill_sidecar(app: AppHandle) {
    let Some(server_state) = app.try_state::<ServerState>() else {
        println!("Server not running");
        return;
    };

    let Some(child) = server_state
        .child
        .lock()
        .expect("Failed to acquire mutex lock")
        .take()
    else {
        println!("No child process to kill");
        return;
    };

    let _ = child.kill();

    println!("Killed server");
}

#[tauri::command]
async fn ensure_server_started(state: State<'_, ServerState>) -> Result<u32, String> {
    // Wait for server to be ready (with timeout)
    let start = Instant::now();
    
    while start.elapsed() < Duration::from_secs(7) {
        if is_server_running(state.port) {
            return Ok(state.port);
        }
        tokio::time::sleep(Duration::from_millis(10)).await;
    }
    
    Err("Server failed to start within 7 seconds".to_string())
}

fn get_sidecar_port() -> u32 {
    option_env!("OPENCODE_PORT")
        .map(|s| s.to_string())
        .or_else(|| std::env::var("OPENCODE_PORT").ok())
        .and_then(|port_str| port_str.parse().ok())
        .unwrap_or_else(|| {
            TcpListener::bind("127.0.0.1:0")
                .expect("Failed to bind to find free port")
                .local_addr()
                .expect("Failed to get local address")
                .port()
        }) as u32
}

fn get_user_shell() -> String {
    std::env::var("SHELL").unwrap_or_else(|_| "/bin/sh".to_string())
}

fn get_sidecar_path() -> std::path::PathBuf {
    tauri::utils::platform::current_exe()
        .expect("Failed to get current exe")
        .parent()
        .expect("Failed to get parent dir")
        .join("opencode-cli")
}

fn spawn_sidecar(app: &AppHandle, port: u32) -> CommandChild {
    let state_dir = app
        .path()
        .resolve("", BaseDirectory::AppLocalData)
        .expect("Failed to resolve app local data dir");

    #[cfg(target_os = "windows")]
    let (mut rx, child) = app
        .shell()
        .sidecar("opencode-cli")
        .unwrap()
        .env("OPENCODE_EXPERIMENTAL_ICON_DISCOVERY", "true")
        .env("OPENCODE_CLIENT", "desktop")
        .env("XDG_STATE_HOME", &state_dir)
        .args(["serve", &format!("--port={port}")])
        .spawn()
        .expect("Failed to spawn opencode");

    #[cfg(not(target_os = "windows"))]
    let (mut rx, child) = {
        let sidecar = get_sidecar_path();
        let shell = get_user_shell();
        app.shell()
            .command(&shell)
            .env("OPENCODE_EXPERIMENTAL_ICON_DISCOVERY", "true")
            .env("OPENCODE_CLIENT", "desktop")
            .env("XDG_STATE_HOME", &state_dir)
            .args([
                "-il",
                "-c",
                &format!("\"{}\" serve --port={}", sidecar.display(), port),
            ])
            .spawn()
            .expect("Failed to spawn opencode")
    };

    tauri::async_runtime::spawn(async move {
        while let Some(event) = rx.recv().await {
            match event {
                CommandEvent::Stdout(line_bytes) => {
                    let line = String::from_utf8_lossy(&line_bytes);
                    print!("{line}");
                }
                CommandEvent::Stderr(line_bytes) => {
                    let line = String::from_utf8_lossy(&line_bytes);
                    eprint!("{line}");
                }
                _ => {}
            }
        }
    });

    child
}

fn is_server_running(port: u32) -> bool {
    TcpStream::connect_timeout(
        &SocketAddr::new(
            "127.0.0.1".parse().expect("Failed to parse IP"),
            port as u16,
        ),
        Duration::from_millis(100),
    )
    .is_ok()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let updater_enabled = option_env!("TAURI_SIGNING_PRIVATE_KEY").is_some();

    let mut builder = tauri::Builder::default()
        .plugin(tauri_plugin_single_instance::init(|app, _args, _cwd| {
            // Focus existing window when another instance is launched
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.set_focus();
                let _ = window.unminimize();
            }
        }))
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(PinchZoomDisablePlugin)
        .invoke_handler(tauri::generate_handler![
            kill_sidecar,
            ensure_server_started
        ])
        .setup(move |app| {
            let app = app.handle().clone();
            
            // Create window immediately with serverReady = false
            let mut window_builder =
            WebviewWindow::builder(&app, "main", WebviewUrl::App("/".into()))
                .title("OpenCode")
                .inner_size(1920.0, 1080.0)
                .decorations(true)
                .zoom_hotkeys_enabled(true)
                .disable_drag_drop_handler();
            
            #[cfg(target_os = "macos")]
            {
                window_builder = window_builder
                .title_bar_style(tauri::TitleBarStyle::Overlay)
                .hidden_title(true);
            }
        
            let window = window_builder.build().expect("Failed to create window");
        
            // Spawn the sidecar if it doesn't exist
            let port = get_sidecar_port();
            app.manage(ServerState::new(None, port));
            if !is_server_running(port) {
                let child = spawn_sidecar(&app, port);
                app.state::<ServerState>().set_child(Some(child));
            }

            let _ = window.set_focus();
            Ok(())
        });

    if updater_enabled {
        builder = builder.plugin(tauri_plugin_updater::Builder::new().build());
    }

    builder
        .build(tauri::generate_context!())
        .expect("error while running tauri application")
        .run(|app, event| {
            if let RunEvent::Exit = event {
                println!("Received Exit");

                kill_sidecar(app.clone());
            }
        });
}
