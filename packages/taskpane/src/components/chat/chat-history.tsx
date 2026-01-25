import {
	Command,
	CommandCollection,
	CommandDialog,
	CommandDialogContent,
	CommandDialogTrigger,
	CommandEmpty,
	CommandGroup,
	type CommandGroupData,
	CommandGroupLabel,
	CommandInput,
	CommandItem,
	type CommandItemData,
	CommandList,
	CommandShortcut,
} from "@packages/ui/components/ui/command";
import { Kbd } from "@packages/ui/components/ui/kbd";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowDownIcon, ArrowUpIcon, CornerDownLeft, History } from "lucide-react";
import { TooltipButton } from "@/components/tooltip-button";
import { getShortcutString, useShortcut } from "@/lib/browser-shortcuts";
import { createChat } from "@/lib/chat";
import { getMessages, prefetchMessages, useGetChats } from "@/lib/convex";
import { useAppState, useOfficeMetadata } from "@/lib/state";
import { getRelativeTime } from "@/lib/utils";

export function ChatHistory() {
	// const queryClient = useQueryClient();
	const { chatHistoryOpen, editor, chat } = useAppState();
	const { id } = useOfficeMetadata();

	const { data: chats } = useGetChats(id);

	const commandGroupData: CommandGroupData[] = [
		{
			label: "Recent",
			items:
				chats?.map((chatItem) => ({
					value: chatItem.chatId,
					label: chatItem.title ?? "New chat",
					shortcut: getRelativeTime(chatItem.updatedAt),
					onClick: () => handleSelectChat(chatItem.chatId),
				})) ?? [],
		},
	];

	const handleOpenChange = (open: boolean) => {
		useAppState.setState({ chatHistoryOpen: open });
		!open && editor.commands.focus();
	};

	useShortcut({ name: "chatHistory", action: () => handleOpenChange(!chatHistoryOpen) });

	const handleSelectChat = async (chatId: string) => {
		const messages = await getMessages(chatId);
		const chat = createChat({ id: chatId, initialMessages: messages });
		useAppState.setState({ chat });
		handleOpenChange(false);
	};

	const handleItemHighlighted = (chatId: string) => {
		prefetchMessages(chatId);
	};

	return (
		<CommandDialog onOpenChange={handleOpenChange} open={chatHistoryOpen}>
			<CommandDialogTrigger
				render={(props, state) => (
					<TooltipButton
						shortcutKeys={getShortcutString("chatHistory")}
						size="icon"
						tooltip="Chat history"
						variant="ghost"
						{...props}
						{...state}
					/>
				)}
			>
				<History />
			</CommandDialogTrigger>
			<CommandDialogContent>
				<Command
					items={commandGroupData}
					itemToStringValue={(item) => (item as CommandItemData).label}
					onItemHighlighted={(item) => handleItemHighlighted((item as CommandItemData).value)}
					onValueChange={(query) => console.log("command query", query)}
				>
					<CommandInput placeholder="Search chat history" />
					<CommandEmpty>No chats found</CommandEmpty>
					<CommandList>
						{(group: CommandGroupData, index) => (
							<CommandGroup items={group.items} key={index}>
								{group.label && <CommandGroupLabel>{group.label}</CommandGroupLabel>}
								<CommandCollection>
									{(item: CommandItemData) => (
										<CommandItem key={item.value} onClick={item.onClick} value={item.value}>
											{item.icon}
											<span className="truncate">{item.label}</span>
											{item.shortcut && <CommandShortcut>{item.shortcut}</CommandShortcut>}
										</CommandItem>
									)}
								</CommandCollection>
							</CommandGroup>
						)}
					</CommandList>
				</Command>
				<div className="absolute inset-x-0 bottom-0 z-20 flex items-center gap-3 border-t bg-muted px-3 py-2">
					<div className="flex items-center gap-1.5">
						<Kbd className="size-5 rounded-xs border bg-background text-muted-foreground">
							<ArrowUpIcon />
						</Kbd>
						<Kbd className="-ml-1 size-5 rounded-xs border bg-background text-muted-foreground">
							<ArrowDownIcon />
						</Kbd>
						<span className="text-muted-foreground text-xs">Navigate</span>
					</div>
					<div className="flex items-center gap-1.5">
						<Kbd className="size-5 rounded-xs border bg-background text-muted-foreground">
							<CornerDownLeft />
						</Kbd>
						<span className="text-muted-foreground text-xs">Select</span>
					</div>
				</div>
			</CommandDialogContent>
		</CommandDialog>
	);
}
