import { Loader2 } from "lucide-react";

export function LoadingPage() {
	return (
		<div className="flex h-screen w-screen bg-muted p-1.5">
			<div className="flex w-full items-center justify-center rounded-lg bg-background p-4">
				<Loader2 className="animate-spin text-muted-foreground" />
			</div>
		</div>
	);
}
