import type { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import { Button, type buttonVariants } from "@packages/ui/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@packages/ui/components/ui/tooltip";
import type { VariantProps } from "class-variance-authority";

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
	tooltipDisabled,
	tooltipAlign,
	shortcutKeys,
	...props
}: TooltipButtonProps) {
	return (
		<Tooltip>
			<TooltipTrigger render={<Button {...props}>{children}</Button>} />
			{tooltip && !tooltipDisabled && (
				<TooltipContent align={tooltipAlign} className="min-h-fit gap-1.5 rounded-sm py-1">
					<span className="font-light">{tooltip}</span>
					{shortcutKeys && <span className="-ml-0.5 font-light text-background/70">{shortcutKeys}</span>}
				</TooltipContent>
			)}
		</Tooltip>
	);
}
