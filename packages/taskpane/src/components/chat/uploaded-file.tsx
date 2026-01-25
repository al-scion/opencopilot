import { Button } from "@packages/ui/components/ui/button";
import type { ContentPart } from "@tanstack/ai";
import { FileText, XIcon } from "lucide-react";
import { ALLOWED_MIME_TYPES } from "@/lib/constants";

export function UploadedFile({ content, remove }: { content: ContentPart; remove: () => void }) {
	const isImage = content.type === "image";

	return (
		<div className="group relative flex size-10 flex-row items-center gap-1 rounded-sm border p-1">
			{isImage && <img height={40} src={content.source.value} width={40} />}
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
