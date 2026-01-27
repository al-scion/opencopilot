import { Button } from "@packages/ui/components/ui/button";
import type { FileUIPart } from "ai";
import { XIcon } from "lucide-react";
import { ALLOWED_MIME_TYPES } from "@/lib/constants";

export function UploadedFile({ file, remove }: { file: FileUIPart; remove: () => void }) {
	const isImage = file.mediaType.startsWith("image/");

	return (
		<div className="group relative flex size-10 flex-row items-center gap-1 rounded-sm border p-1">
			{isImage && <img height={40} src={file.url} width={40} />}
			<Button
				className="absolute -top-1.5 -right-1.5 size-4 items-center justify-center border bg-background p-0 opacity-0 transition-opacity group-hover:opacity-100"
				onClick={remove}
				variant="ghost"
			>
				<XIcon className="size-3" />
			</Button>
		</div>
	);
}
