import type { z } from "zod";
import { officeMetadataSchema } from "./schema";

export const METADATA_STORAGE_KEY = "office-metadata";
export const getOfficeMetadata = (): z.infer<typeof officeMetadataSchema> => {
	const metadata = Office.context.document.settings.get(METADATA_STORAGE_KEY);
	// Must be metadata.state because we are using zustand store
	return officeMetadataSchema.parse(metadata.state);
};
