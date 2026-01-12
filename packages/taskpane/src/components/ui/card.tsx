import type * as React from "react";
import { cn } from "@/lib/utils";

function Card({ className, ...props }: React.ComponentProps<"div">) {
	return <div className={cn("flex flex-col rounded-xl bg-muted p-0.5", className)} data-slot="card" {...props} />;
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
	return <div className={cn("text-muted-foreground text-sm", className)} data-slot="card-title" {...props} />;
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			className={cn("flex min-h-8 flex-row items-center px-2 py-1 font-medium text-sm", className)}
			data-slot="card-header"
			{...props}
		/>
	);
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			className={cn(
				"flex min-h-4 flex-col overflow-auto rounded-lg border bg-background text-sm shadow-none",
				className
			)}
			data-slot="card-content"
			{...props}
		/>
	);
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
	return <div className={cn("flex items-center px-2 py-1", className)} data-slot="card-footer" {...props} />;
}

function CardContentItem({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			className={cn(
				"group/card-item flex select-none flex-row items-center gap-2 border-b p-2 last:border-b-0",
				className
			)}
			data-slot="card-content-item"
			{...props}
		/>
	);
}

export { Card, CardHeader, CardTitle, CardFooter, CardContent, CardContentItem };
