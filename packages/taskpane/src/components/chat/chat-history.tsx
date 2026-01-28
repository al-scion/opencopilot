import {
	Command,
	CommandEmpty,
	type CommandGroupData,
	CommandInput,
	type CommandItemData,
	CommandListTemplate,
} from "@packages/ui/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@packages/ui/components/ui/popover";
import { cn } from "@packages/ui/lib/utils";
import { History } from "lucide-react";
import { TooltipButton } from "@/components/tooltip-button";
import { getShortcutString, useShortcut } from "@/lib/browser-shortcuts";
import { createChat } from "@/lib/chat";
import { getMessages, prefetchMessages, useGetChats } from "@/lib/convex";
import { useAppState, useOfficeMetadata } from "@/lib/state";
import { getRelativeTime } from "@/lib/utils";

export function ChatHistoryPopover() {
	const { chatHistoryOpen, editor } = useAppState();
	const { id } = useOfficeMetadata();

	const { data: chats } = useGetChats(id);

	const commandGroupData: CommandGroupData[] = [
		{
			// label: "Today",
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
		const chat = createChat({ id: chatId, messages });
		useAppState.setState({ chat });
		handleOpenChange(false);
	};

	const handleItemHighlighted = (chatId: string) => {
		prefetchMessages(chatId);
	};

	return (
		<Popover onOpenChange={handleOpenChange} open={chatHistoryOpen}>
			<PopoverTrigger
				render={(props, state) => (
					<TooltipButton
						className={cn(state.open && "bg-muted")}
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
			</PopoverTrigger>
			<PopoverContent className="max-w-60 p-1">
				<Command
					items={commandGroupData}
					// itemToStringValue={(item) => (item as CommandItemData).label}
					onItemHighlighted={(item) => item && handleItemHighlighted((item as CommandItemData).value)}
					onValueChange={(query) => console.log("command query", query)}
				>
					<CommandInput
						className=""
						placeholder="Search chat history..."
						showIcon={false}
						wrapperClassName="h-8 px-2 rounded-sm"
					/>
					<CommandEmpty>No chats found</CommandEmpty>
					<div className="mask-y-from-[calc(100%-4px)]">
						<CommandListTemplate
							className="pt-1"
							groupClassName="py-0"
							itemClassName="rounded-sm"
							itemShortcutClassName="font-light"
						/>
					</div>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
