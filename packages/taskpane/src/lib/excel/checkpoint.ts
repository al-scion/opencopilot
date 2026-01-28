import { getOfficeMetadata } from "@packages/shared";
import { unzipSync, zipSync } from "fflate";
import { server } from "../server";

const getSlice = async (file: Office.File, index: number) =>
	new Promise<number[]>((resolve, reject) => {
		file.getSliceAsync(index, (result) => {
			if (result.status === Office.AsyncResultStatus.Failed) {
				return reject(result.error);
			}
			const data = result.value.data as number[]; // @remarks — Files in the "compressed" format will return a byte array
			resolve(data);
		});
	});

const getWorkbookAsBuffer = () =>
	new Promise<Uint8Array<ArrayBuffer>>((resolve, reject) => {
		Office.context.document.getFileAsync(Office.FileType.Compressed, {}, async (result) => {
			if (result.status === Office.AsyncResultStatus.Failed) {
				return reject(result.error);
			}
			const file = result.value;
			const slices = await Promise.all(Array.from({ length: file.sliceCount }, (_, i) => getSlice(file, i)));
			file.closeAsync();
			const flatSlices = slices.flat();
			const buffer = new ArrayBuffer(flatSlices.length);
			const data = new Uint8Array(buffer);
			data.set(flatSlices);
			resolve(data);
		});
	});

const getWorkbookAsFile = async (): Promise<File> => {
	const fileName = await Excel.run({ delayForCellEdit: true }, async (context) => {
		const workbook = context.workbook.load({ name: true });
		await context.sync();
		return workbook.name;
	});
	const fileType = fileName.endsWith(".xlsm")
		? "application/vnd.ms-excel.sheet.macroEnabled.12"
		: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
	const fileBuffer = await getWorkbookAsBuffer();

	return new File([fileBuffer], fileName, { type: fileType, lastModified: Date.now() });
};

export const getCheckpointId = () => {
	const id = getOfficeMetadata().id;
	const timeStamp = Date.now();
	return `checkpoints/${id}/${timeStamp}`;
};
export const saveFileToStorage = async (key: string) => {
	const file = await getWorkbookAsFile();
	const response = await server.storage.upload.$post({ form: { file, key } });
	const data = await response.json();
	return data;
};

const getBase64StringFromStorage = async (key: string): Promise<string> => {
	const response = await server.storage.files[":key"].$get({ param: { key }, query: {} });
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
