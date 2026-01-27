export const fileToDataUrl = async (file: File) => {
	return await new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
};

export function getRelativeTime(date: Date | number | string) {
	const timeMs = typeof date === "number" ? date : new Date(date).getTime();
	const deltaSeconds = Math.round((timeMs - Date.now()) / 1000);

	const cutoffs = [60, 3600, 86_400, 86_400 * 7, 86_400 * 30, 86_400 * 365, Number.POSITIVE_INFINITY];

	const units = ["s", "m", "h", "d", "w", "mo", "y"];

	const unitIndex = cutoffs.findIndex((cutoff) => cutoff > Math.abs(deltaSeconds));
	const divisor = unitIndex ? cutoffs[unitIndex - 1] : 1;
	const unit = units[unitIndex];

	// Handle edge cases where unit or divisor might be undefined
	if (divisor === undefined || unit === undefined) {
		return "just now";
	}

	const value = Math.floor(Math.abs(deltaSeconds) / divisor);

	// If it's less than 10 seconds, return "just now"
	if (unit === "s" && value < 10) {
		return "just now";
	}

	return `${value}${unit} ago`;
}

export function tryCatch<T, E = Error>(fn: () => T) {
	type Result<TResult, EResult> = { data: TResult; error: null } | { data: null; error: EResult };
	type ReturnType = T extends Promise<infer P> ? Promise<Result<P, E>> : Result<T, E>;

	try {
		const result = fn();
		if (result instanceof Promise) {
			return result
				.then((data: Promise<unknown>) => ({ data, error: null }))
				.catch((e: unknown) => {
					return { data: null, error: e as E };
				}) as ReturnType;
		}
		return { data: result, error: null } as ReturnType;
	} catch (e: unknown) {
		return { data: null, error: e as E } as ReturnType;
	}
}
