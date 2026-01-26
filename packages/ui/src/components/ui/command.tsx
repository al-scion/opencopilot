import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete";
import { Dialog, DialogContent, DialogTrigger } from "@packages/ui/components/ui/dialog";
import { cn } from "@packages/ui/lib/utils";
import { SearchIcon } from "lucide-react";

type CommandItemData = {
	value: string;
	label: string;
	icon?: React.ReactNode;
	shortcut?: React.ReactNode;
	onClick?: () => void;
};
type CommandGroupData = {
	label?: string;
	items: CommandItemData[];
};

const CommandDialog = Dialog;
const CommandDialogTrigger = DialogTrigger;
const CommandDialogContent = DialogContent;

function Command({
	autoHighlight = "always",
	keepHighlight = true,
	loopFocus = true,
	className,
	...props
}: React.ComponentProps<typeof AutocompletePrimitive.Root> & { className?: string }) {
	return (
		<div className={cn("flex h-full w-full flex-col overflow-hidden", className)}>
			<AutocompletePrimitive.Root
				autoHighlight={autoHighlight}
				inline
				keepHighlight={keepHighlight}
				loopFocus={loopFocus}
				open
				{...props}
			/>
		</div>
	);
}

function CommandInput({
	className,
	wrapperClassName,
	autoFocus = true,
	...props
}: React.ComponentProps<typeof AutocompletePrimitive.Input> & { wrapperClassName?: string }) {
	return (
		<div
			className={cn("flex h-9 items-center gap-2 rounded-lg border-none bg-muted px-3", wrapperClassName)}
			data-slot="command-input-wrapper"
		>
			<SearchIcon className="size-4 shrink-0 opacity-50" />
			<AutocompletePrimitive.Input
				autoFocus={autoFocus}
				className={cn(
					"flex h-10 w-full rounded-md bg-transparent py-3 text-sm leading-12 outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
					className
				)}
				data-slot="command-input"
				{...props}
			/>
		</div>
	);
}

function CommandList({ className, ...props }: React.ComponentProps<typeof AutocompletePrimitive.List>) {
	return (
		<AutocompletePrimitive.List
			className={cn("no-scrollbar min-h-0 flex-1 scroll-py-1 overflow-y-auto", className)}
			data-slot="command-list"
			{...props}
		/>
	);
}

function CommandEmpty({ className, ...props }: React.ComponentProps<typeof AutocompletePrimitive.Empty>) {
	return (
		<AutocompletePrimitive.Empty
			className={cn("py-6 text-center text-sm empty:hidden", className)}
			data-slot="command-empty"
			{...props}
		/>
	);
}

function CommandGroup({ className, ...props }: React.ComponentProps<typeof AutocompletePrimitive.Group>) {
	return (
		<AutocompletePrimitive.Group
			className={cn("overflow-visible py-1 text-foreground", className)}
			data-slot="command-group"
			{...props}
		/>
	);
}

function CommandGroupLabel({ className, ...props }: React.ComponentProps<typeof AutocompletePrimitive.GroupLabel>) {
	return (
		<AutocompletePrimitive.GroupLabel
			className={cn("px-2 py-1 font-medium text-muted-foreground text-xs", className)}
			data-slot="command-group-label"
			{...props}
		/>
	);
}

function CommandCollection({ ...props }: React.ComponentProps<typeof AutocompletePrimitive.Collection>) {
	return <AutocompletePrimitive.Collection data-slot="command-collection" {...props} />;
}

function CommandSeparator({ className, ...props }: React.ComponentProps<typeof AutocompletePrimitive.Separator>) {
	return (
		<AutocompletePrimitive.Separator
			className={cn("-mx-1 h-px bg-border", className)}
			data-slot="command-separator"
			{...props}
		/>
	);
}

function CommandItem({ className, ...props }: AutocompletePrimitive.Item.Props) {
	return (
		<AutocompletePrimitive.Item
			className={cn(
				"relative flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-hidden data-disabled:pointer-events-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:opacity-64 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0",
				"truncate",
				className
			)}
			data-slot="autocomplete-item"
			{...props}
		/>
	);
}

function CommandShortcut({ className, ...props }: React.ComponentProps<"span">) {
	return (
		<span
			className={cn("ml-auto text-muted-foreground text-xs tracking-tight", className)}
			data-slot="command-shortcut"
			{...props}
		/>
	);
}

function CommandListTemplate({
	groupClassName,
	groupLabelClassName,
	itemClassName,
	itemShortcutClassName,
	...props
}: React.ComponentProps<typeof AutocompletePrimitive.List> & {
	groupClassName?: string;
	groupLabelClassName?: string;
	itemClassName?: string;
	itemShortcutClassName?: string;
}) {
	return (
		<CommandList {...props}>
			{(group: CommandGroupData, index) => (
				<CommandGroup className={groupClassName} items={group.items} key={index}>
					{group.label && <CommandGroupLabel className={groupLabelClassName}>{group.label}</CommandGroupLabel>}
					<CommandCollection>
						{(item: CommandItemData) => (
							<CommandItem className={itemClassName} key={item.value} onClick={item.onClick} value={item.value}>
								{item.icon}
								<span className="truncate">{item.label}</span>
								{item.shortcut && <CommandShortcut className={itemShortcutClassName}>{item.shortcut}</CommandShortcut>}
							</CommandItem>
						)}
					</CommandCollection>
				</CommandGroup>
			)}
		</CommandList>
	);
}

export {
	Command,
	CommandDialog,
	CommandDialogContent,
	CommandDialogTrigger,
	CommandCollection,
	CommandEmpty,
	CommandGroup,
	CommandGroupLabel,
	CommandInput,
	CommandItem,
	CommandList,
	CommandListTemplate,
	CommandShortcut,
	CommandSeparator,
	type CommandGroupData,
	type CommandItemData,
};
