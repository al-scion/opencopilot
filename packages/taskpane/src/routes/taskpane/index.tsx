import { useChat } from "@ai-sdk/react";
import { Tabs, TabsList, TabsTrigger } from "@packages/ui/components/ui/tabs";
import { createFileRoute } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { ChatHistoryPopover } from "@/components/chat/chat-history";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { SettingsMenu } from "@/components/settings-menu";
import { TooltipButton } from "@/components/tooltip-button";
import { getShortcutString, useShortcut } from "@/lib/browser-shortcuts";
import { createChat } from "@/lib/chat";
import { useAppState } from "@/lib/state";

export const Route = createFileRoute("/taskpane/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { chat, editor } = useAppState();
	const newChat = () => {
		useAppState.setState({ chat: createChat() });
		editor.chain().clearContent().focus("end").run();
	};
	const chatHelpers = useChat({ chat });
	useShortcut({ name: "newChat", action: newChat });
	useShortcut({ name: "stopChat", action: stop });

	return (
		<>
			<div className={"flex flex-row items-center p-2 pr-2.5 pb-0"}>
				<Tabs defaultValue={"chat"}>
					<TabsList className="ring-[0.5px] ring-border" indicatorClassName="ring-[0.5px] ring-border">
						<TabsTrigger value="chat">Chat</TabsTrigger>
						<TabsTrigger value="review">Review</TabsTrigger>
					</TabsList>
				</Tabs>
				<div className="ml-auto flex flex-row items-center gap-0.5">
					<TooltipButton
						onClick={newChat}
						shortcutKeys={getShortcutString("newChat")}
						size="icon"
						tooltip="New chat"
						variant="ghost"
					>
						<PlusIcon />
					</TooltipButton>
					<ChatHistoryPopover />
					<SettingsMenu />
				</div>
			</div>
			<ChatMessages chat={chatHelpers} />
			<ChatInput chat={chatHelpers} />
		</>
	);
}
