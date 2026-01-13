# Fabric

An AI-powered spreadsheet agent built as a plugin for Microsoft Excel with a cross-platform desktop application.

## Overview

Fabric is a monorepo project that provides AI-driven spreadsheet functionality through:

- **Excel Task Pane Add-in** - A web-based plugin that runs inside Microsoft Excel
- **Desktop Application** - A standalone Tauri-based desktop app for cross-platform use
- **Backend Services** - Convex-powered backend with WorkOS authentication

## Project Structure

```text
fabric/
├── packages/
│   ├── desktop/         # Tauri v2 desktop application (React)
│   ├── taskpane/        # Microsoft Excel task pane add-in (React)
│   ├── convex/          # Backend database and functions
│   ├── console/         # Admin console
│   ├── core/            # Shared core functionality
│   └── util/            # Shared utilities
├── .github/workflows/   # CI/CD pipelines
└── install              # CLI installation script
```

## Quick Start

### Prerequisites

- [Bun](https://bun.sh) v1.3.5+
- [Rust](https://rustup.rs/) (for desktop app development)
- Node.js 18+ (for Office Add-in tooling)

### Installation

```bash
# Clone the repository
git clone https://github.com/al-scion/opencopilot.git
cd opencopilot

# Note: The project is named "Fabric", but the repository is "opencopilot".

# Install dependencies
bun install

# Start development
bun run dev
```

## Desktop Application

The desktop app is built with [Tauri v2](https://v2.tauri.app/) and React, featuring:

- **Auto-updates** via minisign-signed releases
- **CLI Integration** via sidecar binaries (OpenCode CLI)
- **Cross-platform** support (macOS, Windows)
- **React 19** with React Compiler optimization

### Development

```bash
cd packages/desktop

# Download sidecar binaries (OpenCode CLI)
RUST_TARGET=aarch64-apple-darwin bun run predev

# Start dev server
bun run dev

# Build production
bun tauri build --target aarch64-apple-darwin
```

### Building Releases

The desktop app uses GitHub Actions for automated releases:

```bash
# Create and push a version tag
git tag v.0.0.8
git push origin v.0.0.8

# GitHub Actions will automatically:
# 1. Build for macOS (aarch64) and Windows (x64)
# 2. Sign updates with minisign
# 3. Generate latest.json for auto-updates
# 4. Create GitHub release with installers
```

### Updater Configuration

The app checks for updates at:
```text
https://github.com/al-scion/opencopilot/releases/latest/download/latest.json
```

Updater signing keys are stored in `packages/desktop/src-tauri/keys/` (gitignored).

## Excel Task Pane Add-in

The Excel add-in provides AI spreadsheet capabilities directly in Microsoft Excel.

### Development

```bash
cd packages/taskpane

# Start dev server with HTTPS (required for Office)
bun run dev

# Start Excel with the add-in loaded
bun run office:start

# Stop Excel debugging
bun run office:stop
```

### Deployment

```bash
# Deploy to Cloudflare Workers
bun run deploy

# Update production secrets
bun run secrets
```

### Production Testing

```bash
# Test with production manifest
bun run office:start:prod
```

## Technology Stack

### Frontend
- **React 19** with [React Compiler](https://react.dev/learn/react-compiler)
- **TanStack Router** for routing
- **TanStack Query** for data fetching
- **Tailwind CSS v4** for styling
- **Tiptap** for rich text editing

### Backend
- **Convex** for database and real-time functions
- **WorkOS** for authentication
- **AI SDK** (Vercel) with Anthropic/OpenAI/Google providers

### Desktop
- **Tauri v2** for native app shell
- **Vite** for bundling
- **TypeScript** with native preview

### Tooling
- **Bun** for package management and runtime
- **Ultracite** (Biome/Oxlint) for linting and formatting
- **Turbo** for monorepo orchestration
- **Knip** for dead code detection

## CI/CD

### Continuous Integration (`ci.yml`)

Runs on pull requests and pushes to `main`:

1. Install dependencies with `bun install --frozen-lockfile`
2. Type check all packages
3. Build all packages

### Release Pipeline (`release.yml`)

Triggers on version tags (e.g., `v.0.0.7`):

1. Matrix builds for macOS (aarch64) and Windows (x64)
2. Downloads OpenCode CLI sidecar binaries
3. Builds Tauri app with production config
4. Signs updates with minisign
5. Generates `latest.json` for auto-updates
6. Publishes GitHub release with installers

## Code Quality

This project uses [Ultracite](https://github.com/stackblitz/ultracite) for strict code quality enforcement:

```bash
# Format and fix issues
bun x ultracite fix

# Check for issues
bun x ultracite check

# Diagnose setup
bun x ultracite doctor
```

See [AGENTS.md](./AGENTS.md) for detailed code standards.

## Scripts

### Root Level

```bash
bun run dev        # Start all packages in dev mode
bun run knip       # Check for unused dependencies
```

### Desktop Package

```bash
bun run predev     # Download sidecar binaries
bun run dev        # Start Vite dev server
bun run build      # Build for production
bun run checktypes # Type check
bun tauri          # Run Tauri CLI commands
```

### Task Pane Package

```bash
bun run dev              # Start dev server
bun run build            # Build for production
bun run deploy           # Deploy to Cloudflare
bun run office:start     # Start Excel with add-in
bun run office:stop      # Stop Excel debugging
bun run office:validate  # Validate manifest
```

## Environment Variables

### Desktop Development

```bash
# Required for sidecar binary download
RUST_TARGET=aarch64-apple-darwin  # or x86_64-pc-windows-msvc

# Optional: specify OpenCode CLI version
OPENCODE_VERSION=v0.1.18
```

### GitHub Secrets (for CI/CD)

```bash
TAURI_SIGNING_PRIVATE_KEY           # Base64-encoded minisign key
TAURI_SIGNING_PRIVATE_KEY_PASSWORD  # Key password
```

## Architecture Notes

### Sidecar Binaries

The desktop app bundles the [OpenCode CLI](https://github.com/anomalyco/opencode) as a sidecar:

- Downloaded from GitHub releases during `predev` script
- Not built from source (binary-only distribution)
- Platform-specific targets required (`RUST_TARGET` env var)
- Copied to `packages/desktop/src-tauri/sidecars/`

### Updater Signing

- Uses **minisign** (not OS code signing)
- Keys generated with `bun tauri signer generate`
- Public key embedded in `tauri.prod.conf.json`
- Private key stored in GitHub Secrets
- Cannot be disabled in Tauri v2

### Version Management

Current version is hardcoded to `0.0.0` in `packages/desktop/package.json`. 

**TODO**: Automate version extraction from git tags before releases.

## Known Issues & Future Work

### High Priority

- [ ] Bump version automatically from git tags
- [ ] Implement updater check UI in desktop app
- [ ] Build actual desktop application features (currently empty React div)
- [ ] Test end-to-end update flow

### Medium Priority

- [ ] Add Linux support to desktop app
- [ ] Add macOS Intel (x86_64) builds
- [ ] Add Windows ARM64 support

### Low Priority

- [ ] Apple Developer ID code signing (requires a paid Apple Developer Program)
- [ ] Windows certificate signing (requires a paid certificate)

## Contributing

1. Create a feature branch from `main`
2. Make your changes following [code standards](./AGENTS.md)
3. Run `bun x ultracite fix` before committing
4. Push and create a pull request
5. CI will run type checks and builds automatically

## License

[Add license information]

## Resources

- [Tauri v2 Documentation](https://v2.tauri.app/)
- [Office Add-ins Documentation](https://learn.microsoft.com/en-us/office/dev/add-ins/)
- [Convex Documentation](https://docs.convex.dev/)
- [Bun Documentation](https://bun.sh/docs)
- [OpenCode CLI](https://github.com/anomalyco/opencode)

## Support

For issues or questions:
- Open an issue in this repository
- Check existing documentation in `/packages/*/README.md`
- Review [AGENTS.md](./AGENTS.md) for code standards

---

Built with Bun, React, Tauri, and Convex.
