import { type HotkeyCallback, type Keys, type Options, useHotkeys } from "react-hotkeys-hook";
import { useAppState } from "./state";

type BrowserShortcut = {
	name: string;
	key: {
		mac: Keys;
		windows: Keys;
	};
	options?: Options;
};

const browserShortcuts = [
	{
		name: "newChat",
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
		name: "chatHistory",
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
		name: "toggleMode",
		key: {
			mac: "alt+p",
			windows: "alt+p",
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
	return useHotkeys(key, action, shortcut.options);
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
		.replace("+", "");

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
