import { convexQuery } from "@convex-dev/react-query";
import { api } from "@packages/convex";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowUpDown, ChevronDown, History } from "lucide-react";
import { useState } from "react";
import { getShortcutString, useShortcut } from "@/lib/browser-shortcuts";
import { createChat } from "@/lib/chat";
import { getMessages, useGetChats } from "@/lib/convex";
import { useAppState } from "@/lib/state";
import { cn, getRelativeTime } from "@/lib/utils";
import { TooltipButton } from "../tooltip-button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandShortcut,
} from "../ui/command";
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from "../ui/dialog";
import { Kbd } from "../ui/kbd";

export function ChatHistory() {
	const queryClient = useQueryClient();
	const { workbookMetadata, chatHistoryOpen, chat, editor } = useAppState();
	const { data: chats, isLoading } = useGetChats(workbookMetadata.documentId);
	const currentChatTitle = chats?.find((item) => item.chatId === chat.id)?.title ?? "New chat";
	// const [value, setValue] = useState("");

	const handleOpenChange = (open: boolean) => {
		useAppState.setState({ chatHistoryOpen: open });
		!open && editor.commands.focus();
	};

	const handleSelectChat = async (chatId: string) => {
		const messages = await getMessages(chatId, queryClient);
		createChat({ id: chatId, messages });
		handleOpenChange(false);
	};

	useShortcut({ name: "chatHistory", action: () => handleOpenChange(!chatHistoryOpen) });

	const handleSetValue = (chatId: string) => {
		// setValue(chatId);
		queryClient.prefetchQuery(convexQuery(api.chat.functions.getMessages, { chatId }));
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
					onValueChange={handleSetValue}
					// value={value}
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
						<Kbd className="border bg-background p-0.5 text-foreground shadow-xs">
							<ArrowUpDown strokeWidth={2.1} />
						</Kbd>
						Navigate
					</div>
					<div className="flex items-center gap-1.5">
						<Kbd className="border bg-background p-0.5 font-normal text-foreground shadow-xs">⏎</Kbd>
						Select
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
