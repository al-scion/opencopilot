import { z } from "zod";

export const officeMetadataSchema = z.object({
	id: z.string(),
});

export const METADATA_STORAGE_KEY = "office-metadata";

export const getOfficeMetadata = (): z.infer<typeof officeMetadataSchema> => {
	const metadata = Office.context.document.settings.get(METADATA_STORAGE_KEY);
	return officeMetadataSchema.parse(metadata);
};
