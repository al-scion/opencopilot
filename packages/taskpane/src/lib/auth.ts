import { useAppState } from "@/lib/state";

export const signInWithDialog = () => {
	Office.context.ui.displayDialogAsync(
		`${window.location.origin}/auth/redirect`,
		{ height: 70, width: 50, promptBeforeOpen: true },
		(response) => {
			response.value.addEventHandler(Office.EventType.DialogMessageReceived, async (event) => {
				response.value.close();
				if ("error" in event) {
					return;
				}
				const refreshToken = event.message;
				localStorage.setItem("workos:refresh-token", refreshToken);
				await useAppState.getState().auth.getAccessToken({ forceRefresh: true });
				window.location.href = `${window.location.origin}/taskpane`;
				// await router.navigate({ to: "/taskpane" });
			});
		}
	);
};

export const getAccessToken = async (): Promise<string> => {
	const auth = useAppState.getState().auth;
	if (auth.user === null) {
		return "";
	}
	return await auth.getAccessToken();
};
