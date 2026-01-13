import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

export type RouterContext = {};

export const Route = createRootRouteWithContext<RouterContext>()({
	component: Outlet,
});
