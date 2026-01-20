import { unzipSync, zipSync } from "fflate";
import { server } from "../server";

export const getWorkbookAsFile = async (): Promise<File> => {
	const fileName = await Excel.run({ delayForCellEdit: true }, async (context) => {
		const workbook = context.workbook.load({ name: true });
		await context.sync();
		return workbook.name;
	});
	return await new Promise((resolve, reject) => {
		Office.context.document.getFileAsync(Office.FileType.Compressed, {}, (result) => {
			if (result.status === Office.AsyncResultStatus.Failed) {
				reject(result.error);
				return;
			}
			const file = result.value;
			const slices: number[][] = [];
			let count = 0;

			for (let i = 0; i < file.sliceCount; i++) {
				file.getSliceAsync(i, (sliceResult) => {
					if (sliceResult.status === Office.AsyncResultStatus.Succeeded) {
						slices[sliceResult.value.index] = sliceResult.value.data;
						count++;
						if (count === file.sliceCount) {
							file.closeAsync();
							const buffer = slices.flat();
							resolve(
								new File([new Uint8Array(buffer)], fileName, {
									type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
								})
							);
						}
					} else {
						file.closeAsync();
						reject(sliceResult.error);
					}
				});
			}
		});
	});
};

export const saveFileToStorage = async (key: string) => {
	const file = await getWorkbookAsFile();
	const response = await server.storage.upload.$post({ form: { file, key } });
	const data = await response.json();
	return data;
};

const getBase64StringFromStorage = async (key: string): Promise<string> => {
	const response = await server.storage.files[":key"].$get({ param: { key } });
	const arrayBuffer = await response.arrayBuffer();

	// Hide the taskpane by setting visibility to 0
	const zipData = new Uint8Array(arrayBuffer);
	const unzippedFile = unzipSync(zipData);

	const taskpanesPath = "xl/webextensions/taskpanes.xml";
	const taskpanesEntry = unzippedFile[taskpanesPath];
	if (taskpanesEntry) {
		const xmlContent = new TextDecoder().decode(taskpanesEntry).replace(/visibility="1"/g, 'visibility="0"');
		unzippedFile[taskpanesPath] = new TextEncoder().encode(xmlContent);
	}
	const modifiedZipData = zipSync(unzippedFile);

	// Convert to base64
	return btoa(Array.from(modifiedZipData, (byte) => String.fromCharCode(byte)).join(""));
};

export const restoreCheckpoint = async (checkpointId: string) => {
	const base64String = await getBase64StringFromStorage(checkpointId);
	return await Excel.run(async (context) => {
		const allWorksheets = context.workbook.worksheets.load({ $all: true });
		await context.sync();
		context.application.suspendScreenUpdatingUntilNextSync();
		const temporaryWorksheet = context.workbook.worksheets.add("__temp");
		allWorksheets.items.forEach((worksheet) => {
			worksheet.delete();
		});
		context.workbook.insertWorksheetsFromBase64(base64String);
		temporaryWorksheet.delete();
		await context.sync();
	});
};
