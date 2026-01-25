import { clientTools, createChatClientOptions, type InferChatMessages } from "@tanstack/ai-client";
import { fetchServerSentEvents } from "@tanstack/ai-react";
import { getAccessToken } from "@/lib/auth";
import {
	clearRangeClient,
	copyPasteClient,
	createWorksheetClient,
	deleteWorksheetClient,
	editRangeClient,
	editWorksheetClient,
	editWorksheetLayoutClient,
	readCommentsClient,
	readWorksheetClient,
	searchWorkbookClient,
	traceFormulaDependentsClient,
	traceFormulaPrecedentsClient,
	writeCommentClient,
} from "@/lib/excel/tools";
import { getWorkbookState } from "@/lib/excel/workbook-state";
import { server } from "@/lib/server";
import { useAgentConfig } from "@/lib/state";

// Temporary fix: augment TextPart to include metadata (missing in @tanstack/ai-client)
// See: https://github.com/TanStack/ai/blob/main/packages/typescript/ai-client/src/types.ts
declare module "@tanstack/ai-client" {
	interface TextPart {
		metadata?: Record<string, unknown>;
	}
}

const tools = clientTools(
	clearRangeClient,
	copyPasteClient,
	createWorksheetClient,
	deleteWorksheetClient,
	editRangeClient,
	editWorksheetClient,
	editWorksheetLayoutClient,
	readCommentsClient,
	readWorksheetClient,
	searchWorkbookClient,
	traceFormulaDependentsClient,
	traceFormulaPrecedentsClient,
	writeCommentClient
);

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

	// const tools = clientTools(editRangeClient, editWorksheetClient, clearRangeDef);

	const chatOptions = createChatClientOptions({
		id,
		initialMessages,
		tools,
		connection,
	});

	return chatOptions;
};
export type UIMessage = InferChatMessages<ReturnType<typeof createChat>>[number];
