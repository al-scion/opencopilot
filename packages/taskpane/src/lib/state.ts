import type { Chat } from "@ai-sdk/react";
import type { agentConfigSchema, MessageType, officeMetadataSchema } from "@packages/shared";
import type { createChatClientOptions } from "@tanstack/ai-react";
import type { Editor } from "@tiptap/react";
import type { useAuth } from "@workos-inc/authkit-react";
import type { z } from "zod";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createChat, createTanstackChat } from "./chat";

type WorkbookState = {
	worksheets: Excel.Worksheet[];
	activeRange: Excel.Range;
	workbook: Excel.Workbook;
};

export type AppState = {
	operatingSystem: "mac" | "windows";
	modelMenuOpen: boolean;
	settingsMenuOpen: boolean;
	chatHistoryOpen: boolean;
	taskpaneOpen: boolean;
	editor: Editor;
	auth: ReturnType<typeof useAuth>;

	// Excel specific states
	workbookState: WorkbookState;
	setWorkbookState: (state: Partial<WorkbookState>) => void;
};

export const useAppState = create<AppState>()((set) => ({
	operatingSystem: navigator.userAgent.toLowerCase().includes("mac") ? "mac" : "windows",
	modelMenuOpen: false,
	settingsMenuOpen: false,
	chatHistoryOpen: false,
	taskpaneOpen: false,
	editor: undefined!,
	auth: undefined!,

	// Workbook specific data
	workbookState: undefined!,
	setWorkbookState: (workbookState) => {
		set((state) => ({
			workbookState: { ...state.workbookState, ...workbookState },
		}));
	},
}));

type ChatStore = {
	chat: Chat<MessageType>;
	tanstackChat: ReturnType<typeof createChatClientOptions>;
};

export const useChatStore = create<ChatStore>()(() => ({
	chat: createChat(),
	tanstackChat: createTanstackChat(),
}));

export const useOfficeMetadata = create<z.infer<typeof officeMetadataSchema>>()(
	persist(
		(set, get) => ({
			id: crypto.randomUUID(),
		}),
		{
			name: "workbook-metadata",
			storage: {
				getItem: (name) => {
					return Office.context.document.settings.get(name);
				},
				setItem: (name, value) => {
					Office.context.document.settings.set(name, value);
					Office.context.document.settings.saveAsync();
				},
				removeItem: (name) => {
					Office.context.document.settings.remove(name);
					Office.context.document.settings.saveAsync();
				},
			},
		}
	)
);

export const useAgentConfig = create<z.infer<typeof agentConfigSchema>>()(
	persist(
		(set, get) => ({
			model: "google/gemini-3-pro-preview",
			mode: "agent",
		}),
		{
			name: "agent-config",
		}
	)
);
