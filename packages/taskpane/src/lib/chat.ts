import { getWorkbookState } from "@packages/shared";
import { clientTools, createChatClientOptions, type InferChatMessages } from "@tanstack/ai-client";
import { fetchServerSentEvents } from "@tanstack/ai-react";
import { getAccessToken } from "@/lib/auth";
import { editRangeClient } from "@/lib/excel/tools";
import { server } from "@/lib/server";
import { useAgentConfig, useOfficeMetadata } from "@/lib/state";

// Temporary fix: augment TextPart to include metadata (missing in @tanstack/ai-client)
// See: https://github.com/TanStack/ai/blob/main/packages/typescript/ai-client/src/types.ts
declare module "@tanstack/ai-client" {
	interface TextPart {
		metadata?: Record<string, unknown>;
	}
}

export const createChat = ({
	id = crypto.randomUUID(),
	initialMessages = [],
}: {
	id?: string;
	initialMessages?: any[];
} = {}) => {
	const serverUrl = server.chat.$url().href;
	const connection = fetchServerSentEvents(serverUrl, async () => ({
		headers: {
			Authorization: `Bearer ${getAccessToken()}`,
		},
		body: {
			agentConfig: useAgentConfig.getState(),
			workbookState: await getWorkbookState(),
		},
		credentials: "include",
	}));

	const tools = clientTools(editRangeClient);
	const chatOptions = createChatClientOptions({
		id,
		initialMessages,
		tools,
		connection,
	});

	return chatOptions;
};
export type UIMessage = InferChatMessages<ReturnType<typeof createChat>>[number];
