import type { MessageType } from "@packages/shared";
import type { ChatStatus } from "ai";
import {
	AlertCircle,
	AlertTriangle,
	ChevronDown,
	ChevronRight,
	Globe,
	Lightbulb,
	ListStart,
	ScanText,
	Search,
	SquarePlus,
	Table,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { MarkdownText } from "./markdown-text";

function ToolMessage(props: React.ComponentProps<typeof AccordionItem>) {
	return (
		<Accordion>
			<AccordionItem {...props} />
		</Accordion>
	);
}

function ToolMessageTrigger({
	className,
	children,
	showIcon,
	...props
}: React.ComponentProps<typeof AccordionTrigger>) {
	return (
		<AccordionTrigger
			className={cn(
				"flex max-w-full flex-row items-center justify-start gap-2 p-0.5 font-normal text-muted-foreground",
				className
			)}
			showIcon={false}
			{...props}
		>
			{children}
		</AccordionTrigger>
	);
}

function ToolMessageContent({ className, children, ...props }: React.ComponentProps<typeof AccordionContent>) {
	return (
		<AccordionContent
			className={cn("my-1 mr-1 ml-[8.5px] max-h-36 overflow-y-auto border-l-1 p-0.5 pl-[12.5px]", className)}
			{...props}
		>
			{children}
		</AccordionContent>
	);
}

export function AssistantMessage({ message, status }: { message: MessageType; status: ChatStatus }) {
	return (
		<div className="flex flex-col gap-1 px-0.5 py-2 text-sm" key={message.id}>
			{message.parts.map((part, i) => {
				const key = `${message.id}-${i}`;

				if (part.type === "tool-readWorksheet") {
					return (
						<ToolMessage key={key}>
							<ToolMessageTrigger>
								<Search className="size-3.5" />
								Read {part.input?.worksheet}
							</ToolMessageTrigger>
							<ToolMessageContent>{JSON.stringify(part.input, null, 2)}</ToolMessageContent>
						</ToolMessage>
					);
				}

				if (part.type === "tool-editRange") {
					return (
						<ToolMessage key={key}>
							<ToolMessageTrigger>
								<Table className="size-3.5" />
								Edited {part.input?.worksheet}
								{part.state === "output-error" && <AlertCircle className="size-3.5 text-destructive" />}
							</ToolMessageTrigger>
							<ToolMessageContent>
								{JSON.stringify(part.input?.values, null, 2)}
								{JSON.stringify(part.output, null, 2)}
							</ToolMessageContent>
						</ToolMessage>
					);
				}

				if (part.type === "tool-copyPaste") {
					return (
						<ToolMessage key={key}>
							<ToolMessageTrigger>
								<ScanText className="size-3.5" />
								Copied formula {part.input?.source?.address} - {part.input?.destination?.address}
								{part.state === "output-error" && <AlertCircle className="size-3.5 text-destructive" />}
							</ToolMessageTrigger>
							<ToolMessageContent>
								{/* {JSON.stringify(part.input?.values, null, 2)} */}
								{JSON.stringify(part.output, null, 2)}
							</ToolMessageContent>
						</ToolMessage>
					);
				}

				if (part.type === "tool-createWorksheet") {
					return (
						<ToolMessage key={key}>
							<ToolMessageTrigger showIcon={false}>
								<SquarePlus className="size-3.5" />
								Created worksheet {part.input?.name}
							</ToolMessageTrigger>
						</ToolMessage>
					);
				}

				if (part.type === "tool-searchWorkbook") {
					return (
						<ToolMessage key={key}>
							<ToolMessageTrigger>
								<Search className="size-3.5" />
								Searched workbook for "{part.input?.query}"
							</ToolMessageTrigger>
						</ToolMessage>
					);
				}

				if (part.type === "tool-traceFormula") {
					return (
						<ToolMessage key={key}>
							<ToolMessageTrigger>
								<ListStart className="size-3.5" />
								Traced formula {part.input?.address}
							</ToolMessageTrigger>
						</ToolMessage>
					);
				}

				if (part.type === "tool-webSearch") {
					return (
						<ToolMessage key={key}>
							<ToolMessageTrigger>
								<Globe className="size-3.5 group-hover/accordion-trigger:hidden" />
								<ChevronRight className="hidden size-3.5 transition-transform duration-200 ease-in-out group-hover/accordion-trigger:block group-data-panel-open/accordion-trigger:rotate-90" />
								<span className="truncate">Searched for "{part.input?.query}"</span>
							</ToolMessageTrigger>
							<ToolMessageContent>{JSON.stringify(part.output?.map((result) => result.title))}</ToolMessageContent>
						</ToolMessage>
					);
				}

				if (part.type === "tool-webFetch") {
					return (
						<ToolMessage key={key}>
							<ToolMessageTrigger>
								<Globe className="size-3.5" />
								<span className="truncate">Fetched {part.input?.urls?.join(", ")}</span>
							</ToolMessageTrigger>
						</ToolMessage>
					);
				}

				if (part.type === "tool-getScreenshot") {
					return null;
				}

				if (part.type === "reasoning") {
					return (
						<ToolMessage key={key}>
							<ToolMessageTrigger>
								<Lightbulb className="size-3.5 group-hover/accordion-trigger:hidden" />
								<ChevronRight className="hidden size-3.5 transition-transform duration-200 ease-in-out group-hover/accordion-trigger:block group-data-panel-open/accordion-trigger:rotate-90" />
								Reasoning
							</ToolMessageTrigger>
							<ToolMessageContent>
								<MarkdownText mode="static">{part.text}</MarkdownText>
							</ToolMessageContent>
						</ToolMessage>
					);
				}

				if (part.type === "text") {
					return (
						<MarkdownText className="px-0.5" key={key}>
							{part.text}
						</MarkdownText>
					);
				}

				if (part.type === "step-start") {
					return null;
				}

				return (
					<pre className="text-xs" key={key}>
						{JSON.stringify(part, null, 2)}
					</pre>
				);
			})}
		</div>
	);
}
