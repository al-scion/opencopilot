import { ConvexQueryClient, convexQuery } from "@convex-dev/react-query";
import { api } from "@packages/convex";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { ConvexReactClient } from "convex/react";
import { env } from "../env";

export const convexReactClient = new ConvexReactClient(env.VITE_CONVEX_URL);
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
