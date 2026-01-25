import type { agentConfigSchema, officeMetadataSchema } from "@packages/shared";
import { METADATA_STORAGE_KEY } from "@packages/shared";
import type { Editor } from "@tiptap/react";
import type { z } from "zod";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createChat } from "./chat";

const useAgentConfig = create<z.infer<typeof agentConfigSchema>>()(
	persist(
		(set, get) => ({
			model: "anthropic/claude-opus-4-5",
			permission: "ask",
		}),
		{
			name: "agent-config",
		}
	)
);

type AppState = {
	operatingSystem: "mac" | "windows";
	modelMenuOpen: boolean;
	settingsMenuOpen: boolean;
	shortcutMenuOpen: boolean;
	chatHistoryOpen: boolean;
	taskpaneOpen: boolean;
	taskpaneFocused: boolean;
	editor: Editor;
	chat: ReturnType<typeof createChat>;

	worksheets: Excel.Worksheet[];
	selectedRange: Excel.Range;
};

const initialWorkbookState = await Excel.run({ delayForCellEdit: true }, async (context) => {
	const activeRange = context.workbook.getSelectedRange().load({ address: true });
	const worksheets = context.workbook.worksheets.load({ $all: true });
	await context.sync();
	return {
		worksheets: worksheets.items,
		activeRange,
	};
});

const useAppState = create<AppState>()((set) => {
	const updateTaskpaneFocus = () => {
		const isVisible = document.visibilityState === "visible";
		set({ taskpaneFocused: isVisible && document.hasFocus() });
	};

	window.addEventListener("focus", updateTaskpaneFocus);
	window.addEventListener("blur", updateTaskpaneFocus);
	document.addEventListener("visibilitychange", updateTaskpaneFocus);

	// First, set up events to ensure sync
	Office.addin.onVisibilityModeChanged((e) =>
		set({
			taskpaneOpen: e.visibilityMode === Office.VisibilityMode.taskpane,
			taskpaneFocused:
				e.visibilityMode === Office.VisibilityMode.taskpane &&
				document.visibilityState === "visible" &&
				document.hasFocus(),
		})
	);

	Excel.run({ delayForCellEdit: true }, async (context) => {
		context.runtime.set({ enableEvents: true });
		context.workbook.onSelectionChanged.add(async (e) => {
			const selectedRange = context.workbook.getSelectedRange().load({ address: true })!;
			await context.sync();
			console.log("Active range changed");
			set({ selectedRange });
		});
		context.workbook.worksheets.onChanged.add(async (e) => {
			const worksheets = context.workbook.worksheets.load({ $all: true });
			await context.sync();
			set({ worksheets: worksheets.items });
		});
	});

	return {
		operatingSystem: navigator.userAgent.toLowerCase().includes("mac") ? "mac" : "windows",
		modelMenuOpen: false,
		settingsMenuOpen: false,
		shortcutMenuOpen: false,
		chatHistoryOpen: false,
		taskpaneOpen: false,
		taskpaneFocused: document.visibilityState === "visible" && document.hasFocus(),
		editor: undefined!,
		chat: createChat(),

		worksheets: initialWorkbookState.worksheets,
		selectedRange: initialWorkbookState.activeRange,
	};
});

const useOfficeMetadata = create<z.infer<typeof officeMetadataSchema>>()(
	persist(
		(set, get, options) => {
			// DO NOT EDIT THIS! Temporary fix to make zustand persist work on first hydration!!
			if (Office.context.document.settings.get(METADATA_STORAGE_KEY) === null) {
				set({ id: crypto.randomUUID() });
			}
			return {
				id: crypto.randomUUID(),
			};
		},
		{
			name: METADATA_STORAGE_KEY,
			storage: {
				getItem: (name) => {
					console.log("loading office metadata", name);
					return Office.context.document.settings.get(name);
				},
				setItem: (name, value) => {
					console.log("saving office metadata", name, value);
					Office.context.document.settings.set(name, value);
					Office.context.document.settings.saveAsync();
				},
				removeItem: (name) => {
					Office.context.document.settings.remove(name);
					Office.context.document.settings.saveAsync();
				},
			},
		}
	)
);

export { useAppState, useOfficeMetadata, useAgentConfig };
