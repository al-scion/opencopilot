import { registerNamedRange } from "@/lib/excel/conditional-format";
import { registerCustomFunctionsAndShortcuts } from "@/lib/excel/config";
import { registerEvents } from "@/lib/excel/events";
import { initWorkbookMetadata } from "@/lib/excel/metadata";
import { useAppState } from "@/lib/state";

export const initWorkbook = async () => {
	// First, wait for the office to be ready and execute
	await Office.onReady(async ({ host, platform }) => {
		console.log("Office.onReady", host, platform);
		Office.addin.showAsTaskpane().then(() => useAppState.setState({ taskpaneOpen: true }));
		await Office.addin.setStartupBehavior(Office.StartupBehavior.none);
		const startupBehavior = await Office.addin.getStartupBehavior();

		const officePlatformMap = {
			[Office.PlatformType.Mac]: "mac",
			[Office.PlatformType.PC]: "windows",
			[Office.PlatformType.OfficeOnline]: "web",
		} as const;
		useAppState.getState().setWorkbookConfig({
			documentMode: Office.context.document.mode === Office.DocumentMode.ReadWrite ? "readWrite" : "readOnly",
			documentUrl: Office.context.document.url,
			officePlatform: officePlatformMap[platform] ?? "web",
			isDarkTheme: Office.context.officeTheme?.isDarkTheme ?? false,
			loadOnStartup: startupBehavior === Office.StartupBehavior.load,
		});
	});

	// All of this will stay pending until the user exits cell edit state
	await Excel.run({ delayForCellEdit: true }, async (context) => {
		const workbook = context.workbook.load({ name: true });
		const worksheets = context.workbook.worksheets.load({ $all: true });
		const activeRange = context.workbook.getSelectedRange().load({ address: true });
		await context.sync();
		useAppState.getState().setWorkbookState({
			worksheets: worksheets.items,
			activeRange,
			name: workbook.name,
		});

		await initWorkbookMetadata();
		await registerEvents();
		await registerNamedRange();
		registerCustomFunctionsAndShortcuts();
	});
};
