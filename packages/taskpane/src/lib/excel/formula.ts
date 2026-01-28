import {
	authErrorCell,
	getCellValueCard,
	imageModelSchema,
	inPreviewErrorCell,
	languageModelRegistry,
	languageModelSchema,
} from "@packages/shared";
import { server } from "../server";

export const memoize = <T extends (...args: any[]) => any>(fn: T): ((...args: Parameters<T>) => Promise<void>) => {
	const cache = new Map<string, any>();
	const inFlight = new Map<string, Promise<any>>();
	return async (...args: Parameters<T>) => {
		const invocation = args.at(-1) as CustomFunctions.StreamingInvocation<Excel.ErrorCellValue[][]>;

		const functionArgs = args.slice(0, -1);
		const cacheKeys = [functionArgs, invocation.functionName];
		const cacheString = JSON.stringify(cacheKeys);
		console.log("running custom function with key:", cacheString);

		const abortController = new AbortController();
		invocation.onCanceled = () => {
			console.log("aborting", cacheString);
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

		// Check for auth state, TBD, auth check on the server maybe...
		// if (getAccessToken() === null) {
		// 	invocation.setResult([[authErrorCell]]);
		// 	return;
		// }

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
	const modelId = languageModelSchema.catch("anthropic/claude-opus-4-5").parse(model);
	const response = await server.formulas.text.$post(
		{
			json: {
				prompt,
				model: modelId,
			},
		},
		{ init: { signal } }
	);

	const data = await response.json();
	const card = getCellValueCard({ basicValue: data.text });
	return [[card]];
};

export const generateImage = async (prompt: string, model: string | null, signal: AbortSignal) => {
	const modelId = imageModelSchema.catch("google/gemini-3-pro-image-preview").parse(model);
	const response = await server.formulas.image.$post(
		{
			json: {
				prompt,
				model: modelId,
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
