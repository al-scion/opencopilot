import type { UIMessageType } from "@packages/shared";
import {
	Accordion,
	AccordionChevron,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@packages/ui/components/ui/accordion";
import { cn } from "@packages/ui/lib/utils";
import {
	BaselineIcon,
	CameraIcon,
	CircleXIcon,
	ClipboardCheckIcon,
	MessageCirclePlusIcon,
	PaintBucketIcon,
	RemoveFormattingIcon,
	SlidersHorizontalIcon,
	TableIcon,
	TypeOutlineIcon,
} from "lucide-react";
import { StickToBottom } from "use-stick-to-bottom";
import { focusWorksheet } from "@/lib/excel/navigate";
import { MarkdownText } from "./markdown-text";

export function AssistantMessage({ message }: { message: UIMessageType }) {
	return (
		<div className="flex flex-col gap-1 px-0.5 py-2 text-sm" key={message.id}>
			{message.parts.map((part, i) => {
				const key = `${message.id}-${i}`;

				if (part.type === "step-start") {
					return null;
				}

				if (part.type === "reasoning") {
					return (
						<Accordion defaultValue={part.state === "streaming" ? [key] : undefined} key={`${key}-${part.state}`}>
							<AccordionItem className="mx-0.5" value={key}>
								<AccordionTrigger className="gap-1 py-0">
									<span
										className={cn("text-muted-foreground text-xs", part.state === "streaming" && "animate-ellipsis")}
									>
										{part.state === "streaming" ? "Thinking" : "Thought"}
									</span>
									<span className="text-muted-foreground/75 text-xs">
										{part.state === "done" && `for ${Math.max(1, Math.ceil(part.text.length / 200))}s`}
									</span>
									<AccordionChevron
										className={cn(
											"size-3 -rotate-90 text-muted-foreground/75 opacity-0 group-hover/accordion-trigger:opacity-100 group-data-panel-open/accordion-trigger:rotate-0 group-data-panel-open/accordion-trigger:opacity-100",
											part.state === "streaming" && "hidden"
										)}
									/>
								</AccordionTrigger>
								<AccordionContent className="no-scrollbar max-h-36 overflow-y-auto">
									<StickToBottom>
										<StickToBottom.Content>
											<MarkdownText className="text-xs" mode={part.state === "streaming" ? "streaming" : "static"}>
												{part.text}
											</MarkdownText>
										</StickToBottom.Content>
									</StickToBottom>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					);
				}

				if (part.type === "text") {
					return (
						<MarkdownText className="px-0.5" key={key}>
							{part.text}
						</MarkdownText>
					);
				}

				if (part.type === "tool-readWorksheet" && part.state === "output-available") {
					return (
						<div
							className="group/item flex cursor-pointer flex-row items-center gap-1 px-0.5"
							key={key}
							onClick={() => focusWorksheet(part.input.worksheet)}
						>
							<span className="text-muted-foreground text-xs">Read</span>
							<span className="text-muted-foreground/75 text-xs">{part.input.worksheet}</span>
						</div>
					);
				}

				if (part.type === "tool-searchWorkbook") {
					return (
						<div className="group/item flex cursor-pointer flex-row items-center gap-1 px-0.5" key={key}>
							<span className="text-muted-foreground text-xs">Searched</span>
							<span className="text-muted-foreground/75 text-xs">{part.input?.query}</span>
						</div>
					);
				}

				if (part.type === "tool-readComments") {
					return (
						<div className="group/item flex cursor-pointer flex-row items-center gap-1 px-0.5" key={key}>
							<span className="text-muted-foreground text-xs">Read comments</span>
							{/* <span className="text-muted-foreground/75 text-xs">{part.input?.query}</span> */}
						</div>
					);
				}

				if (part.type === "tool-evaluateFormula") {
					return (
						<div className="group/item flex cursor-pointer flex-row items-center gap-1 px-0.5" key={key}>
							<span className="text-muted-foreground text-xs">Checked formula</span>
							<span className="text-muted-foreground/75 text-xs">{part.input?.formulas?.join(", ")}</span>
						</div>
					);
				}

				if (part.type === "tool-traceFormulaPrecedents") {
					return (
						<div className="group/item flex cursor-pointer flex-row items-center gap-1 px-0.5" key={key}>
							<span className="text-muted-foreground text-xs">Traced formula</span>
							<span className="text-muted-foreground/75 text-xs">
								{part.input?.worksheet}!{part.input?.address}
							</span>
						</div>
					);
				}

				if (part.type === "tool-editRange") {
					return (
						<Accordion key={key} onClick={() => {}}>
							<AccordionItem className="mx-0.5 rounded-md border bg-muted">
								<AccordionTrigger className="p-2">
									<TableIcon className="size-3.5 self-center text-muted-foreground" />
									<span className="font-normal text-muted-foreground text-xs">
										Edited {part.input?.worksheet}!{part.input?.address}
									</span>
								</AccordionTrigger>
							</AccordionItem>
						</Accordion>
					);
				}

				if (part.type === "tool-clearRange") {
					return (
						<Accordion key={key}>
							<AccordionItem className="mx-0.5 rounded-md border bg-muted">
								<AccordionTrigger className="p-2">
									<CircleXIcon className="size-3.5 self-center text-muted-foreground" />
									<span className="font-normal text-muted-foreground text-xs">
										Cleared {part.input?.worksheet}!{part.input?.address}
									</span>
								</AccordionTrigger>
							</AccordionItem>
						</Accordion>
					);
				}

				if (part.type === "tool-copyPaste") {
					return (
						<Accordion key={key}>
							<AccordionItem className="mx-0.5 rounded-md border bg-muted">
								<AccordionTrigger className="p-2">
									<ClipboardCheckIcon className="size-3.5 self-center text-muted-foreground" />
									<span className="font-normal text-muted-foreground text-xs">
										Copied {part.input?.source?.address}
									</span>
								</AccordionTrigger>
							</AccordionItem>
						</Accordion>
					);
				}

				if (part.type === "tool-createWorksheet") {
					return (
						<Accordion key={key}>
							<AccordionItem className="mx-0.5 rounded-md border bg-muted">
								<AccordionTrigger className="p-2">
									<TableIcon className="size-3.5 self-center text-muted-foreground" />
									<span className="text-muted-foreground text-xs">Created worksheet</span>
									<span className="-ml-1 text-muted-foreground/75 text-xs">{part.input?.name}</span>
								</AccordionTrigger>
							</AccordionItem>
						</Accordion>
					);
				}

				if (part.type === "tool-editWorksheet") {
					const changes = Object.entries(part.input || {})
						.map(([key]) => key)
						.join(", ");
					return (
						<Accordion key={key}>
							<AccordionItem className="mx-0.5 rounded-md border bg-muted">
								<AccordionTrigger className="p-2">
									<SlidersHorizontalIcon className="size-3.5 self-center text-muted-foreground" />
									<span className="text-muted-foreground text-xs">Changed worksheet</span>
									<span className="-ml-1 text-muted-foreground/75 text-xs">{changes}</span>
								</AccordionTrigger>
							</AccordionItem>
						</Accordion>
					);
				}

				if (part.type === "tool-getScreenshot" && part.state === "output-available") {
					const dataUrl = `data:image/png;base64,${part.output.base64String}`;
					return (
						<Accordion key={key}>
							<AccordionItem className="mx-0.5 rounded-md border bg-muted">
								<AccordionTrigger className="p-1 pl-2">
									<CameraIcon className="size-3.5 self-center text-muted-foreground" />
									<span className="text-muted-foreground text-xs">Screenshot</span>
									<img alt="Screenshot" className="ml-auto size-6 rounded border object-cover" src={dataUrl} />
								</AccordionTrigger>
							</AccordionItem>
						</Accordion>
					);
				}

				if (part.type === "tool-setBackgroundColour") {
					return (
						<Accordion key={key}>
							<AccordionItem className="mx-0.5 rounded-md border bg-muted">
								<AccordionTrigger className="p-2">
									<PaintBucketIcon className="size-3.5 self-center text-muted-foreground" />
									<span className="text-muted-foreground text-xs">Formatted</span>
									<span className="-ml-1 text-muted-foreground/75 text-xs">
										{part.input?.worksheet}!{part.input?.address}
									</span>
								</AccordionTrigger>
							</AccordionItem>
						</Accordion>
					);
				}

				if (part.type === "tool-writeComment") {
					return (
						<Accordion key={key}>
							<AccordionItem className="mx-0.5 rounded-md border bg-muted">
								<AccordionTrigger className="p-2">
									<MessageCirclePlusIcon className="size-3.5 self-center text-muted-foreground" />
									<span className="text-muted-foreground text-xs">Inserted comment</span>
									<span className="-ml-1 text-muted-foreground/75 text-xs">
										{part.input?.worksheet}!{part.input?.address}
									</span>
								</AccordionTrigger>
							</AccordionItem>
						</Accordion>
					);
				}

				if (part.type === "tool-createChart") {
					return (
						<Accordion key={key}>
							<AccordionItem className="mx-0.5 rounded-md border bg-muted">
								<AccordionTrigger className="p-2">
									<MessageCirclePlusIcon className="size-3.5 self-center text-muted-foreground" />
									<span className="text-muted-foreground text-xs">Inserted comment</span>
									<span className="-ml-1 text-muted-foreground/75 text-xs">
										{part.input?.worksheet}!{part.input?.address}
									</span>
								</AccordionTrigger>
							</AccordionItem>
						</Accordion>
					);
				}

				// if (part.type === "tool-createChart") {
				// 	return (
				// 		<ToolMessage key={key}>
				// 			<ToolMessageTrigger className="rounded-md border bg-muted p-2">
				// 				<span>Created chart</span>
				// 			</ToolMessageTrigger>
				// 		</ToolMessage>
				// 	);
				// }

				// if (part.type === "tool-getScreenshot" && part.state === "output-available") {
				// 	const dataUrl = `data:image/png;base64,${part.output.base64String}`;
				// 	return (
				// 		<ToolMessage key={key}>
				// 			<ToolMessageTrigger className="rounded-md border bg-muted p-1 pl-2">
				// 				Screenshot
				// 				<img alt="Screenshot" className="ml-auto size-6 rounded border object-cover" src={dataUrl} />
				// 			</ToolMessageTrigger>
				// 		</ToolMessage>
				// 	);
				// }

				// if (part.type === "tool-editRange") {
				// 	return (
				// 		<ToolMessage key={key}>
				// 			<ToolMessageTrigger>
				// 				{/* <Table className="size-3.5 group-hover/accordion-trigger:hidden" /> */}
				// 				<ChevronRight className="hidden size-3.5 transition-transform duration-200 ease-in-out group-hover/accordion-trigger:block group-data-panel-open/accordion-trigger:rotate-90" />
				// 				<span>Edited</span>
				// 				<span className="text-muted-foreground/75">{part.input?.worksheet}</span>
				// 			</ToolMessageTrigger>
				// 			<ToolMessageContent>{JSON.stringify(part.output, null, 2)}</ToolMessageContent>
				// 		</ToolMessage>
				// 	);
				// }

				// if (part.type === "tool-copyPaste") {
				// 	return (
				// 		<ToolMessage key={key}>
				// 			<ToolMessageTrigger>
				// 				<ScanText className="size-3.5" />
				// 				Copied formula {part.input?.source?.address} - {part.input?.destination?.address}
				// 				{part.state === "output-error" && <AlertCircle className="size-3.5 text-destructive" />}
				// 			</ToolMessageTrigger>
				// 			<ToolMessageContent>
				// 				{/* {JSON.stringify(part.input?.values, null, 2)} */}
				// 				{JSON.stringify(part.output, null, 2)}
				// 			</ToolMessageContent>
				// 		</ToolMessage>
				// 	);
				// }

				// if (part.type === "tool-createWorksheet") {
				// 	return (
				// 		<ToolMessage key={key}>
				// 			<ToolMessageTrigger showIcon={false}>
				// 				<SquarePlus className="size-3.5" />
				// 				Created worksheet {part.input?.name}
				// 			</ToolMessageTrigger>
				// 		</ToolMessage>
				// 	);
				// }

				// if (part.type === "tool-searchWorkbook") {
				// 	return (
				// 		<ToolMessage key={key}>
				// 			<ToolMessageTrigger>
				// 				<Search className="size-3.5" />
				// 				Searched workbook for "{part.input?.query}"
				// 			</ToolMessageTrigger>
				// 		</ToolMessage>
				// 	);
				// }

				// if (part.type === "tool-traceFormula") {
				// 	return (
				// 		<ToolMessage key={key}>
				// 			<ToolMessageTrigger>
				// 				<ListStart className="size-3.5" />
				// 				Traced formula {part.input?.address}
				// 			</ToolMessageTrigger>
				// 		</ToolMessage>
				// 	);
				// }

				// if (part.type === "tool-webSearch") {
				// 	return (
				// 		<ToolMessage key={key}>
				// 			<ToolMessageTrigger>
				// 				<Globe className="size-3.5 group-hover/accordion-trigger:hidden" />
				// 				<ChevronRight className="hidden size-3.5 transition-transform duration-200 ease-in-out group-hover/accordion-trigger:block group-data-panel-open/accordion-trigger:rotate-90" />
				// 				<span className="truncate">Searched for "{part.input?.query}"</span>
				// 			</ToolMessageTrigger>
				// 			<ToolMessageContent>{JSON.stringify(part.output?.map((result) => result.title))}</ToolMessageContent>
				// 		</ToolMessage>
				// 	);
				// }

				// if (part.type === "tool-webFetch") {
				// 	return (
				// 		<ToolMessage key={key}>
				// 			<ToolMessageTrigger>
				// 				<Globe className="size-3.5" />
				// 				<span className="truncate">Fetched {part.input?.urls?.join(", ")}</span>
				// 			</ToolMessageTrigger>
				// 		</ToolMessage>
				// 	);
				// }

				return (
					<pre className="text-xs" key={key}>
						{JSON.stringify(part, null, 2)}
					</pre>
				);
			})}
		</div>
	);
}
