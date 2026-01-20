import { authErrorCell, getCellValueCard, inPreviewErrorCell } from "@packages/shared";
import { server } from "@/lib/server";
import { useAppState } from "@/lib/state";

export const memoize = <T extends (...args: any[]) => any>(fn: T): ((...args: Parameters<T>) => Promise<void>) => {
	const cache = new Map<string, any>();
	const inFlight = new Map<string, Promise<any>>();
	return async (...args: Parameters<T>) => {
		console.log("memoize", args);
		const invocation = args.at(-1) as CustomFunctions.StreamingInvocation<Excel.ErrorCellValue[][]>;

		const functionArgs = args.slice(0, -1);
		const cacheKeys = [functionArgs, invocation.functionName];
		const cacheString = JSON.stringify(cacheKeys);

		const abortController = new AbortController();
		invocation.onCanceled = () => {
			abortController.abort();
			inFlight.delete(cacheString);
		};

		if (cache.has(cacheString)) {
			invocation.setResult(cache.get(cacheString));
			return;
		}

		if (inFlight.has(cacheString)) {
			const result = await inFlight.get(cacheString);
			invocation.setResult(result);
			return;
		}

		if (invocation.isInValuePreview) {
			invocation.setResult([[inPreviewErrorCell]]);
			return;
		}

		// Check for auth state
		if (useAppState.getState().auth.user === null) {
			invocation.setResult([[authErrorCell]]);
			return;
		}

		try {
			const promise = fn(...functionArgs, abortController.signal);
			inFlight.set(cacheString, promise);
			const result = await promise;
			cache.set(cacheString, result);
			invocation.setResult(result);
		} catch (error) {
			console.error(error);
			invocation.setResult({ code: CustomFunctions.ErrorCode.notAvailable, message: "Error" });
		} finally {
			inFlight.delete(cacheString);
		}
	};
};

export const generateText = async (prompt: string, model: string | null, signal: AbortSignal) => {
	const response = await server.formulas.text.$post(
		{
			json: {
				text: prompt,
				model: model ?? undefined,
			},
		},
		{ init: { signal } }
	);

	const data = await response.json();
	const card = getCellValueCard({ basicValue: data });
	return [[card]];
};

export const generateImage = async (prompt: string, model: string | null, signal: AbortSignal) => {
	const response = await server.formulas.image.$post(
		{
			json: {
				prompt,
				model: model ?? undefined,
			},
		},
		{ init: { signal } }
	);
	const { fileUrl, downloadUrl } = await response.json();

	const card = getCellValueCard({
		basicValue: "Image",
		image: { imageUrl: fileUrl, downloadUrl },
		icon: Excel.EntityCompactLayoutIcons.image,
	});

	return [[card]];
};
