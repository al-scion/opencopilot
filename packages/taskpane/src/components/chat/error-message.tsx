import type { useChat } from "@ai-sdk/react";

type Chat = ReturnType<typeof useChat>;
type ChatError = Chat["error"];
type ClearError = Chat["clearError"];
type Regenerate = Chat["regenerate"];

export function ErrorMessage({ error }: { error: ChatError }) {
	if (!error) {
		return null;
	}

	return (
		<div className="flex flex-col gap-1 px-0.5 py-2 text-sm">
			<span className="text-xs">{error.name}</span>
			<span className="text-xs">{error.message}</span>
		</div>
	);
}
