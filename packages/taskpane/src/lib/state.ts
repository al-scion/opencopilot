import type { Chat } from "@ai-sdk/react";
import type { MessageType } from "@packages/shared";
import { type AgentConfig, initialAgentConfig } from "@packages/shared";
import type { createChatClientOptions } from "@tanstack/ai-react";
import type { Editor } from "@tiptap/react";
import type { useAuth } from "@workos-inc/authkit-react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createChat, createTanstackChat } from "./chat";
import type { WorkbookMetadata } from "./excel/metadata";

type WorkbookConfig = {
	documentUrl: string;
	documentMode: "readOnly" | "readWrite";
	officePlatform: "mac" | "windows" | "web";
	isDarkTheme: boolean;
	loadOnStartup: boolean;
};

type WorkbookState = {
	worksheets: Excel.Worksheet[];
	activeRange: Excel.Range;
	name: string;
};

export type AppState = {
	operatingSystem: "mac" | "windows";
	editor: Editor;
	modelMenuOpen: boolean;
	settingsMenuOpen: boolean;
	chatHistoryOpen: boolean;
	taskpaneOpen: boolean;

	chat: Chat<MessageType>;
	tanstackChat: ReturnType<typeof createChatClientOptions>;
	auth: ReturnType<typeof useAuth>;

	// Agent speicific state
	agentConfig: AgentConfig;
	setAgentConfig: (config: Partial<AgentConfig>) => void;

	// Excel specific states
	workbookConfig: WorkbookConfig;
	setWorkbookConfig: (config: Partial<WorkbookConfig>) => void;
	workbookMetadata: WorkbookMetadata;
	setWorkbookMetadata: (metadata: Partial<WorkbookMetadata>) => void;
	workbookState: WorkbookState;
	setWorkbookState: (state: Partial<WorkbookState>) => void;
};

export const useAppState = create<AppState>()(
	persist(
		(set, get) => ({
			operatingSystem: navigator.userAgent.toLowerCase().includes("mac") ? "mac" : "windows",
			editor: undefined!,
			modelMenuOpen: false,
			settingsMenuOpen: false,
			chatHistoryOpen: false,
			taskpaneOpen: false,

			chat: createChat(),
			tanstackChat: createTanstackChat(),
			auth: undefined!,

			agentConfig: initialAgentConfig,
			setAgentConfig: (config) => {
				set((state) => ({
					agentConfig: { ...state.agentConfig, ...config },
				}));
			},

			// Workbook specific data
			workbookConfig: undefined!,
			setWorkbookConfig: (config) => {
				set((state) => ({
					workbookConfig: { ...state.workbookConfig, ...config },
				}));
			},
			workbookMetadata: undefined!,
			setWorkbookMetadata: (metadata) => {
				set((state) => ({
					workbookMetadata: { ...state.workbookMetadata, ...metadata },
				}));
			},
			workbookState: undefined!,
			setWorkbookState: (workbookState) => {
				set((state) => ({
					workbookState: { ...state.workbookState, ...workbookState },
				}));
			},
		}),
		{
			name: "app-state",
			partialize: (state) => ({
				agentConfig: state.agentConfig,
				workbookConfig: state.workbookConfig,
			}),
		}
	)
);
