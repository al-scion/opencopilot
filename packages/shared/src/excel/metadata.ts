import { z } from "zod";

export const officeMetadataSchema = z.object({
	id: z.string(),
});

export const getOfficeMetadata = (): z.infer<typeof officeMetadataSchema> => {
	const metadata = Office.context.document.settings.get("office-metadata");
	return officeMetadataSchema.parse(metadata);
};
