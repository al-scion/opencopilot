import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { cn } from "@packages/ui/lib/utils";
import { ChevronDownIcon } from "lucide-react";

function Accordion(props: AccordionPrimitive.Root.Props) {
	return <AccordionPrimitive.Root data-slot="accordion" {...props} />;
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
	return <AccordionPrimitive.Item className={cn("", className)} data-slot="accordion-item" {...props} />;
}

function AccordionTrigger({
	className,
	children,
	showIcon = true,
	...props
}: AccordionPrimitive.Trigger.Props & { showIcon?: boolean }) {
	return (
		<AccordionPrimitive.Header className="flex">
			<AccordionPrimitive.Trigger
				className={cn(
					"flex flex-1 cursor-pointer items-center justify-between gap-4 py-2 text-left font-normal text-sm outline-none transition-all focus-visible:ring-[3px] focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-64 [&[data-panel-open]>.accordion-chevron]:rotate-180",
					"group/accordion-trigger [&_svg]:shrink-0",
					className
				)}
				data-slot="accordion-trigger"
				{...props}
			>
				{children}
				{showIcon && (
					<ChevronDownIcon className="accordion-chevron pointer-events-none ml-auto size-3.5 shrink-0 self-center opacity-80 transition-transform duration-200 ease-in-out" />
				)}
			</AccordionPrimitive.Trigger>
		</AccordionPrimitive.Header>
	);
}

function AccordionPanel({ className, children, ...props }: AccordionPrimitive.Panel.Props) {
	return (
		<AccordionPrimitive.Panel
			className="h-(--accordion-panel-height) overflow-hidden text-muted-foreground text-sm transition-[height] duration-200 ease-in-out data-ending-style:h-0 data-starting-style:h-0"
			data-slot="accordion-panel"
			{...props}
		>
			<div className={cn("py-1", className)}>{children}</div>
		</AccordionPrimitive.Panel>
	);
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionPanel, AccordionPanel as AccordionContent };
