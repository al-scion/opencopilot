import { ConvexQueryClient, convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { api } from "@packages/convex";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ConvexReactClient } from "convex/react";

export const convexReactClient = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);
export const convexQueryClient = new ConvexQueryClient(convexReactClient);
export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			queryKeyHashFn: convexQueryClient.hashFn(),
			queryFn: convexQueryClient.queryFn(),
		},
	},
});
convexQueryClient.connect(queryClient);

export const useGetChats = (namespace: string) => {
	return useQuery({
		...convexQuery(api.chat.functions.getChats, { namespace }),
	});
};

export const prefetchMessages = async (chatId: string) => {
	queryClient.prefetchQuery({
		...convexQuery(api.chat.functions.getMessages, { chatId }),
	});
};

export const getMessages = async (chatId: string) => {
	const data = await queryClient.fetchQuery({
		...convexQuery(api.chat.functions.getMessages, { chatId }),
	});
	const messages = data.map((message) => message.message);
	return messages;
};

export const useSaveChat = () => {
	return useMutation({
		mutationFn: useConvexMutation(api.chat.functions.saveChat),
	});
};
