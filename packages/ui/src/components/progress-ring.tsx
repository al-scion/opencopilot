import { cn } from "@packages/ui/lib/utils";

interface ProgressRingProps {
	value: number;
	size?: number;
	strokeWidth?: number;
	className?: string;
	progressClassName?: string;
}

export const ProgressRing = ({
	value,
	className,
	progressClassName,
	size = 24,
	strokeWidth = 3,
}: ProgressRingProps) => {
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;
	const offset = circumference * ((100 - value) / 100);

	return (
		<svg height={size} style={{ transform: "rotate(-90deg)" }} viewBox={`0 0 ${size} ${size}`} width={size}>
			<circle
				className={cn("stroke-border", className)}
				cx={size / 2}
				cy={size / 2}
				fill="transparent"
				r={radius}
				strokeWidth={strokeWidth}
			/>
			<circle
				className={cn("stroke-primary", progressClassName)}
				cx={size / 2}
				cy={size / 2}
				fill="transparent"
				r={radius}
				strokeDasharray={circumference}
				strokeDashoffset={offset}
				strokeLinecap="round"
				strokeWidth={strokeWidth}
			/>
		</svg>
	);
};
