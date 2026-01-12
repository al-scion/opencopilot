import { autoFormat } from "@/lib/excel/auto-format";
import { syncWorkbookMetadata } from "@/lib/excel/metadata";
import { useAppState } from "@/lib/state";

export const registerEvents = async () => {
	// Update zustand store when taskpane is opened or closed
	Office.addin.onVisibilityModeChanged((e) => {
		useAppState.setState({ taskpaneOpen: e.visibilityMode === Office.VisibilityMode.taskpane });
	});

	await Excel.run({ delayForCellEdit: true }, async (context) => {
		// Must enable events for the runtime to work
		context.runtime.set({ enableEvents: true });

		// Workbook events
		context.workbook.onSelectionChanged.add(async (e) => {});
		context.workbook.onAutoSaveSettingChanged.add(async (e) => {});
		context.workbook.onActivated.add(async (e) => {});
		context.workbook.onSelectionChanged.add(selectionChangedHandler);
		context.workbook.settings.onSettingsChanged.add(() => syncWorkbookMetadata());

		// Worksheet events
		context.workbook.worksheets.onSelectionChanged.add(selectionChangedHandler);
		context.workbook.worksheets.onSelectionChanged.add(async (e) => {});

		context.workbook.worksheets.onAdded.add(async (e) => {});
		context.workbook.worksheets.onDeleted.add(async (e) => {});
		context.workbook.worksheets.onChanged.add(autoFormat);
		context.workbook.worksheets.onAdded.add(worksheetCollectionChangedHandler);
		context.workbook.worksheets.onDeleted.add(worksheetCollectionChangedHandler);
		context.workbook.worksheets.onChanged.add(worksheetCollectionChangedHandler);
		context.workbook.worksheets.onSingleClicked.add(async (e) => {});

		// Comment events
		context.workbook.comments.onAdded.add(async (e) => {});
		context.workbook.comments.onChanged.add(async (e) => {});
		context.workbook.comments.onDeleted.add(async (e) => {});
	});

	console.log("Events registered");
};

const selectionChangedHandler = async () => {
	await Excel.run({ delayForCellEdit: true }, async (context) => {
		const currentRange = context.workbook.getSelectedRange().load({ address: true });
		await context.sync();
		useAppState.getState().setWorkbookState({ activeRange: currentRange });
	});
};

const worksheetCollectionChangedHandler = async () => {
	await Excel.run({ delayForCellEdit: true }, async (context) => {
		const worksheets = context.workbook.worksheets.load({ name: true, position: true });
		await context.sync();
		useAppState.getState().setWorkbookState({ worksheets: worksheets.items });
	});
};
