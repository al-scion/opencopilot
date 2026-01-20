import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandShortcut,
} from "@packages/ui/components/ui/command";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "@packages/ui/components/ui/dialog";
import { Kbd } from "@packages/ui/components/ui/kbd";
import { cn } from "@packages/ui/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowDownIcon, ArrowUpIcon, CornerDownLeft, History } from "lucide-react";
import { TooltipButton } from "@/components/tooltip-button";
import { getShortcutString, useShortcut } from "@/lib/browser-shortcuts";
import { createChat } from "@/lib/chat";
import { getMessages, prefetchMessages, useGetChats } from "@/lib/convex";
import { useAppState, useChatStore, useOfficeMetadata } from "@/lib/state";
import { getRelativeTime } from "@/lib/utils";

export function ChatHistory() {
	const queryClient = useQueryClient();
	const { chat } = useChatStore();
	const { chatHistoryOpen, editor } = useAppState();
	const { id } = useOfficeMetadata();

	const { data: chats, isLoading } = useGetChats(id);

	const handleOpenChange = (open: boolean) => {
		useAppState.setState({ chatHistoryOpen: open });
		!open && editor.commands.focus();
	};

	useShortcut({ name: "chatHistory", action: () => handleOpenChange(!chatHistoryOpen) });

	const handleSelectChat = async (chatId: string) => {
		const messages = await getMessages(chatId, queryClient);
		useChatStore.setState({ chat: createChat({ id: chatId, messages }) });
		handleOpenChange(false);
	};

	const handleHighlightedValueChange = (chatId: string) => {
		prefetchMessages(chatId, queryClient);
	};

	return (
		<Dialog onOpenChange={handleOpenChange} open={chatHistoryOpen}>
			<DialogTrigger
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
			</DialogTrigger>
			<DialogContent className="min-h-100 p-2" showCloseButton={false}>
				<DialogHeader className="sr-only">Chat history</DialogHeader>
				<Command
					filter={(value, search, keywords) => (keywords?.join().toLowerCase().includes(search.toLowerCase()) ? 1 : 0)}
					loop
					onValueChange={handleHighlightedValueChange}
				>
					<CommandInput placeholder="Search chat history" wrapperClassName="border-none bg-muted rounded-lg" />
					<CommandList className="no-scrollbar min-h-80 overflow-auto pt-1 pb-7">
						<CommandEmpty>No chats found</CommandEmpty>
						<CommandGroup className="px-0">
							{chats?.map((chatItem) => (
								<CommandItem
									className={cn("tracking-tight", !chatItem.title && "text-muted-foreground")}
									key={chatItem._id}
									keywords={[chatItem.title ?? ""]}
									onSelect={() => handleSelectChat(chatItem.chatId)}
									value={chatItem.chatId}
								>
									{chatItem.title || "New chat"}
									<CommandShortcut className="font-light tracking-tight">
										{getRelativeTime(chatItem.updatedAt)}
									</CommandShortcut>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
				<div className="absolute inset-x-0 bottom-0 z-20 flex items-center gap-3 rounded-b-xl border-t bg-muted px-3 py-2 text-foreground text-xs">
					<div className="flex items-center gap-1.5">
						<Kbd className="size-5 rounded-xs border bg-background text-muted-foreground">
							<ArrowUpIcon />
						</Kbd>
						<Kbd className="-ml-1 size-5 rounded-xs border bg-background text-muted-foreground">
							<ArrowDownIcon />
						</Kbd>
						<span className="text-muted-foreground">Navigate</span>
					</div>
					<div className="flex items-center gap-1.5">
						<Kbd className="size-5 rounded-xs border bg-background text-muted-foreground">
							<CornerDownLeft />
						</Kbd>
						<span className="text-muted-foreground">Select</span>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
