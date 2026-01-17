import { Button } from "@packages/ui/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@packages/ui/components/ui/tooltip";
import type { FileUIPart } from "ai";
import { FileText, XIcon } from "lucide-react";
import { ALLOWED_MIME_TYPES } from "@/lib/constants";

export function UploadedFile({ file, removeFile }: { file: FileUIPart; removeFile: () => void }) {
	const isImage = file.mediaType.startsWith("image/");

	return (
		<Tooltip>
			<TooltipTrigger delay={1500}>
				<div className="group relative flex size-10 flex-row items-center gap-1 rounded-sm border p-1">
					{isImage && <img alt={file.filename} height={40} src={file.url} width={40} />}
					<Button
						className="absolute -top-1.5 -right-1.5 size-4 items-center justify-center border bg-background p-0 opacity-0 transition-opacity group-hover:opacity-100"
						onClick={removeFile}
						variant="ghost"
					>
						<XIcon className="size-3" />
					</Button>
				</div>
			</TooltipTrigger>
			<TooltipContent sideOffset={10}>
				<span className="font-light">{file.filename}</span>
			</TooltipContent>
		</Tooltip>
	);
}
