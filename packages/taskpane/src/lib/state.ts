import type { agentConfigSchema, officeMetadataSchema } from "@packages/shared";
import { METADATA_STORAGE_KEY } from "@packages/shared";
import type { Editor } from "@tiptap/react";
import type { z } from "zod";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { getActiveSelection } from "@/lib/excel/utils";
import { createChat } from "./chat";

const useAgentConfig = create<z.infer<typeof agentConfigSchema>>()(
	persist(
		(set, get) => {
			const isReadOnly = Office.context.document.mode === Office.DocumentMode.ReadOnly;
			return {
				model: "anthropic/claude-opus-4-5",
				permission: isReadOnly ? "read" : "ask",
			};
		},
		{
			name: "agent-config",
			merge: (persistedState, current) => {
				const persisted = persistedState as z.infer<typeof agentConfigSchema>;
				const merged = { ...current, ...persisted };
				const isReadOnly = Office.context.document.mode === Office.DocumentMode.ReadOnly;
				return {
					...merged,
					permission: isReadOnly ? "read" : merged.permission,
				};
			},
		}
	)
);

type AppState = {
	operatingSystem: "mac" | "windows";
	modelMenuOpen: boolean;
	permissionMenuOpen: boolean;
	settingsMenuOpen: boolean;
	shortcutMenuOpen: boolean;
	chatHistoryOpen: boolean;
	taskpaneOpen: boolean;
	taskpaneFocused: boolean;
	editor: Editor;
	chat: ReturnType<typeof createChat>;

	worksheets: Excel.Worksheet[];
	charts: Excel.Chart[];
	activeRange: Excel.Interfaces.RangeData | null;
	activeShape: Excel.Interfaces.ShapeData | null;
	activeChart: Excel.Interfaces.ChartData | null;
};

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
			const activeSelection = await getActiveSelection();
			set({
				activeChart: activeSelection.activeChart,
				activeShape: activeSelection.activeShape,
				activeRange: activeSelection.activeRange,
			});
		});
		context.workbook.worksheets.onAdded.add(async (e) => {
			const worksheets = context.workbook.worksheets.load({ $all: true });
			await context.sync();
			set({ worksheets: worksheets.items });
		});
		context.workbook.worksheets.onDeleted.add(async (e) => {
			const worksheets = context.workbook.worksheets.load({ $all: true });
			await context.sync();
			set({ worksheets: worksheets.items });
		});
		context.workbook.worksheets.onNameChanged.add(async (e) => {
			const worksheets = context.workbook.worksheets.load({ $all: true });
			await context.sync();
			set({ worksheets: worksheets.items });
		});
		context.workbook.worksheets.onChanged.add(async (e) => {
			const worksheets = context.workbook.worksheets.load({ $all: true, charts: { $all: true } });
			await context.sync();
			const charts = worksheets.items.flatMap((worksheet) => worksheet.charts.items);
			set({ charts });
		});
	});

	// Initialize workbook state asynchronously
	Excel.run({ delayForCellEdit: true }, async (context) => {
		const worksheets = context.workbook.worksheets.load({ $all: true, charts: { $all: true } });
		await context.sync();
		const charts = worksheets.items.flatMap((worksheet) => worksheet.charts.items);
		const activeSelection = await getActiveSelection();

		set({
			worksheets: worksheets.items,
			charts,
			activeChart: activeSelection.activeChart,
			activeShape: activeSelection.activeShape,
			activeRange: activeSelection.activeRange,
		});
	});

	return {
		operatingSystem: navigator.userAgent.toLowerCase().includes("mac") ? "mac" : "windows",
		modelMenuOpen: false,
		permissionMenuOpen: false,
		settingsMenuOpen: false,
		shortcutMenuOpen: false,
		chatHistoryOpen: false,
		taskpaneOpen: false,
		taskpaneFocused: document.visibilityState === "visible" && document.hasFocus(),
		editor: undefined!,
		chat: createChat(),

		worksheets: [],
		charts: [],
		activeRange: null,
		activeShape: null,
		activeChart: null,
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
