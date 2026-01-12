import { router } from "@/main";
import { useAppState } from "./state";

export const signInWithDialog = () => {
	Office.context.ui.displayDialogAsync(
		`${window.location.origin}/auth/redirect`,
		{ height: 70, width: 50 },
		(response) => {
			const dialog = response.value;
			dialog.addEventHandler(Office.EventType.DialogMessageReceived, async (event) => {
				dialog.close();
				if ("error" in event) {
					return;
				}
				const refreshToken = event.message;
				localStorage.setItem("workos:refresh-token", refreshToken);
				await useAppState.getState().auth.getAccessToken({ forceRefresh: true });
				router.navigate({ to: "/taskpane" });
			});
		}
	);
};
