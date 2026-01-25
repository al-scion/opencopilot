export function ErrorMessage({ error }: { error: Error | undefined }) {
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
