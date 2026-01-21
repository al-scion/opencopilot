import { PluginKey } from "@tiptap/pm/state";
import { SuggestionPluginKey, type SuggestionProps } from "@tiptap/suggestion";

type MentionPluginState = {
	query: SuggestionProps["query"];
	range: SuggestionProps["range"];
	text: SuggestionProps["text"];
	active: boolean;
	composing: boolean;
	decorationId: string | null;
};

export const MentionPluginKey = new PluginKey<MentionPluginState>("suggestion");

export function CommandMenu({ mentionState }: { mentionState: MentionPluginState | undefined }) {
	return null;
}
