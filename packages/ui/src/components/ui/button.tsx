import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import type * as React from "react";
import { cn } from "@packages/ui/lib/utils";

const buttonVariants = cva(
	"inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm outline-none transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground hover:bg-primary/90",
				destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20",
				outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground [&>svg]:text-foreground",
				secondary: "border bg-secondary text-secondary-foreground hover:bg-secondary/80",
				ghost:
					"hover:bg-accent hover:text-accent-foreground active:text-foreground [&>svg:not([class*='text-'])]:text-muted-foreground",
				link: "text-primary underline-offset-4 hover:underline [&>svg:not([class*='text-'])]:text-muted-foreground",
				primary: "border-primary-700 bg-primary-600 font-medium text-white hover:opacity-90",
				skeuomorphic:
					"relative border border-primary-800 bg-primary-600 text-background shadow-xs before:absolute before:inset-0 before:rounded-[5px] before:border-y before:border-t-primary-500 before:border-b-primary-700 hover:opacity-95",
			},
			size: {
				default: "h-8 px-2",
				icon: "size-6 rounded-sm p-0", // active:scale-95 to make it shrink when clicked
				sm: "h-6 gap-1 px-2 font-medium text-xs",
				md: "h-7 gap-1.5 px-1.5",
				lg: "h-8 px-2",
				full: "h-8 w-full justify-start px-2",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	}
);

interface ButtonProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
	render?: useRender.RenderProp;
}

function Button({ className, variant, size, render = <button type="button" />, ...props }: ButtonProps) {
	return useRender({
		render,
		props: {
			"data-slot": "button",
			className: cn(buttonVariants({ variant, size, className })),
			...props,
		},
	});
}

export { Button, buttonVariants };
