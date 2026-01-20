import { convexQuery, useConvexAction, useConvexMutation, useConvexQuery } from "@convex-dev/react-query";
import { api } from "@packages/convex";
import type { MessageType } from "@packages/shared/";
import { type QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { validateUIMessages } from "ai";

// export const useGetKv = (key: string) => {
// 	const isValid = key !== "";
// 	return useQuery({
// 		...convexQuery(api.kv.functions.getKV, isValid ? { key } : "skip"),
// 	});
// };

// export const useSetKv = () => {
// 	return useMutation({
// 		mutationFn: useConvexMutation(api.kv.functions.setKV).withOptimisticUpdate((localStore, args) => {
// 			localStore.setQuery(api.kv.functions.getKV, { key: args.key }, args.value);
// 		}),
// 	});
// };

export const useGetChats = (namespace?: string) => {
	const isValid = namespace !== undefined;
	return useQuery({
		...convexQuery(api.chat.functions.getChats, isValid ? { namespace } : "skip"),
	});
};

export const prefetchMessages = async (chatId: string, queryClient: QueryClient) => {
	queryClient.prefetchQuery({
		...convexQuery(api.chat.functions.getMessages, { chatId }),
	});
};

export const getMessages = async (chatId: string, queryClient: QueryClient) => {
	const data = await queryClient.fetchQuery({
		...convexQuery(api.chat.functions.getMessages, { chatId }),
	});
	const messages = data.map((message) => message.message);
	const validatedMessages = await validateUIMessages<MessageType>({ messages });
	return validatedMessages;
};
