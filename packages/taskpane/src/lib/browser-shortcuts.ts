import { type HotkeyCallback, type Keys, type Options, useHotkeys } from "react-hotkeys-hook";
import { useAppState } from "./state";

type BrowserShortcut = {
	name: string;
	label: string;
	key: {
		mac: Keys;
		windows: Keys;
	};
	options?: Options;
};

export const browserShortcuts = [
	{
		name: "newChat",
		label: "New chat",
		key: {
			mac: "alt+n",
			windows: "alt+n",
		},
		options: {
			enableOnContentEditable: true,
			enableOnFormTags: true,
			preventDefault: true,
		},
	},
	{
		name: "toggleTaskpane",
		label: "Focus input or worksheet",
		key: {
			mac: "meta+j",
			windows: "ctrl+j",
		},
		options: {},
	},
	{
		name: "chatHistory",
		label: "Chat history",
		key: {
			mac: "alt+h",
			windows: "alt+h",
		},
		options: {
			enableOnContentEditable: true,
			enableOnFormTags: true,
			preventDefault: true,
		},
	},
	{
		name: "shortcutMenu",
		label: "Shortcut menu",
		key: {
			mac: "meta+slash",
			windows: "ctrl+slash",
		},
		options: {
			enableOnFormTags: true,
			enableOnContentEditable: true,
			preventDefault: true,
		},
	},
	{
		name: "togglePermission",
		label: "Set permission",
		key: {
			mac: "shift+tab",
			windows: "shift+tab",
		},
		options: {
			enableOnContentEditable: true,
			enableOnFormTags: true,
			preventDefault: true,
			keydown: true,
		},
	},
	{
		name: "toggleModel",
		label: "Select model",
		key: {
			mac: "alt+m",
			windows: "alt+m",
		},
		options: {
			enableOnContentEditable: true,
			enableOnFormTags: true,
			preventDefault: true,
		},
	},
	{
		name: "openSettings",
		label: "Open settings",
		key: {
			mac: "alt+s",
			windows: "alt+s",
		},
		options: {
			enableOnContentEditable: true,
			enableOnFormTags: true,
			preventDefault: true,
		},
	},
	{
		name: "stopChat",
		label: "Stop chat",
		key: {
			mac: "meta+backspace",
			windows: "ctrl+backspace",
		},
		options: {
			enableOnContentEditable: true,
			enableOnFormTags: true,
			preventDefault: true,
		},
	},
	{
		name: "uploadFile",
		label: "Upload file",
		key: {
			mac: "meta+shift+u",
			windows: "ctrl+shift+u",
		},
		options: {
			enableOnContentEditable: true,
			enableOnFormTags: true,
			preventDefault: true,
		},
	},
] as const satisfies BrowserShortcut[];

type ShortcutName = (typeof browserShortcuts)[number]["name"];

type UseShortcutParams = {
	name: ShortcutName;
	action: HotkeyCallback;
};

export const useShortcut = ({ name, action }: UseShortcutParams) => {
	const { operatingSystem } = useAppState();
	const shortcut = browserShortcuts.find((shortcut) => shortcut.name === name)!;
	const key = shortcut.key[operatingSystem];

	useHotkeys(
		key,
		(event, key) => {
			event.stopPropagation();
			action(event, key);
		},
		shortcut.options
	);
};

export const getShortcutString = (name: ShortcutName) => {
	const shortcut = browserShortcuts.find((shortcut) => shortcut.name === name)!;
	const operatingSystem = useAppState.getState().operatingSystem;
	const key = shortcut.key[operatingSystem];

	// Universal key map.§
	// - Converts to upper case
	// - Replaces common key names with symbols
	// - Removes the + symbol
	const keyString = key
		.toUpperCase()

		.replace("ENTER", "⏎")
		.replace("COMMA", ",")
		.replace("SLASH", "/")
		.replace("PERIOD", ".")
		.replace("EQUAL", "=")
		.replace("MINUS", "-")
		.replace("SEMICOLON", ";")
		.replace("UP", "↑")
		.replace("DOWN", "↓")
		.replace("LEFT", "←")
		.replace("RIGHT", "→")
		.replace("TAB", "Tab")
		.replace("BRACKETLEFT", "[")
		.replace("BRACKETRIGHT", "]")
		.replaceAll("+", "");

	// Mac specific key map
	const macKeyString = keyString
		.replace("CONTROL", "Ctrl")
		.replace("META", "⌘")
		.replace("ALT", "⌥")
		.replace("SHIFT", "⇧")
		.replace("BACKSPACE", "⌫");

	const windowsKeyString = keyString
		.replace("CONTROL", "Ctrl+")
		.replace("ALT", "Alt+")
		.replace("SHIFT", "Shift+")
		.replace("BACKSPACE", "Backspace");

	return operatingSystem === "mac" ? macKeyString : windowsKeyString;
};
