import { server } from "../server";
import { useAppState } from "../state";

export const getWorkbookAsFile = async (): Promise<File> => {
	const fileName = useAppState.getState().workbookState.name;
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
	const blob = await response.blob();
	return await new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			const result = reader.result as string;
			const base64 = result.split(",")[1];
			if (!base64) {
				reject(new Error("Failed to extract base64 data from file"));
				return;
			}
			resolve(base64);
		};
		reader.onerror = () => reject(reader.error || new Error("Failed to read file"));
		reader.readAsDataURL(blob);
	});
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
