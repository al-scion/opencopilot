import { WORKOS_ACCESS_TOKEN_KEY, WORKOS_REFRESH_TOKEN_KEY } from "./constants";

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
				localStorage.setItem(WORKOS_REFRESH_TOKEN_KEY, refreshToken);
				window.location.href = `${window.location.origin}/taskpane`;
			});
		}
	);
};

export const getAccessToken = () => sessionStorage.getItem(WORKOS_ACCESS_TOKEN_KEY) ?? "";
