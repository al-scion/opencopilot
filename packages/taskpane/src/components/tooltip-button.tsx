import type { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import type { VariantProps } from "class-variance-authority";
import type * as React from "react";
import { Button, type buttonVariants } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface TooltipButtonProps extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	children?: React.ReactNode;
	tooltip?: string;
	tooltipDisabled?: boolean;
	tooltipAlign?: TooltipPrimitive.Positioner.Props["align"];
	shortcutKeys?: string;
}

export function TooltipButton({
	children,
	tooltip,
	className,
	tooltipDisabled,
	tooltipAlign,
	shortcutKeys,
	...props
}: TooltipButtonProps) {
	return (
		<Tooltip>
			<TooltipTrigger
				render={
					<Button className={cn(className)} {...props}>
						{children}
					</Button>
				}
			/>
			{tooltip && !tooltipDisabled && (
				<TooltipContent align={tooltipAlign} className="min-h-fit gap-1.5 rounded-sm py-1">
					<span className="font-light">{tooltip}</span>
					{shortcutKeys && <span className="-ml-0.5 font-light text-background/70">{shortcutKeys}</span>}
				</TooltipContent>
			)}
		</Tooltip>
	);
}
