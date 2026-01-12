import { create } from "zustand";

type AppState = {
	serverUrl: string;
	port: number;
};

export const useAppState = create<AppState>()((set) => ({
	serverUrl: undefined!,
	port: undefined!,
}));
