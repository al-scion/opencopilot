import { z } from "zod";
import { useAppState } from "@/lib/state";

export const workbookMetadataSchema = z.object({
	documentId: z.string().optional(),
});
export type WorkbookMetadata = z.infer<typeof workbookMetadataSchema>;
const initialWorkbookMetadata: WorkbookMetadata = {
	documentId: crypto.randomUUID(),
};

const isWorkbookMetadataInitialized = (metadata: WorkbookMetadata): boolean => {
	if (!metadata.documentId) {
		return false;
	}
	return true;
};

export const syncWorkbookMetadata = async () => {
	return await Excel.run({ delayForCellEdit: true }, async (context) => {
		const settings = context.workbook.settings.load({ $all: true });
		await context.sync();
		const settingsObject = Object.fromEntries(settings.items.map((item) => [item.key, item.value]));
		const metadata = workbookMetadataSchema.parse(settingsObject);
		useAppState.getState().setWorkbookMetadata(metadata);
		return metadata;
	});
};

export const setWorkbookMetadata = async (metadata: Partial<z.infer<typeof workbookMetadataSchema>>) => {
	const context = new Excel.RequestContext();
	Object.entries(metadata).forEach(([key, value]) => {
		context.workbook.settings.add(key, value);
	});
	await context.sync();
	useAppState.getState().setWorkbookMetadata(metadata);
};

export const initWorkbookMetadata = async () => {
	const metadata = await syncWorkbookMetadata();
	const isInitialized = isWorkbookMetadataInitialized(metadata);
	if (!isInitialized) {
		await setWorkbookMetadata(initialWorkbookMetadata);
	}
};
