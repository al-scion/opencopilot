import { cn } from "@packages/ui/lib/utils";
import { Streamdown, type StreamdownProps } from "streamdown";
import { handleCitation } from "@/lib/excel/navigation";

export function MarkdownText({ children, components, className, ...props }: StreamdownProps) {
	return (
		<Streamdown className={cn("px-0.5", className)} components={streamdownComponents} {...props}>
			{children}
		</Streamdown>
	);
}

const streamdownComponents: StreamdownProps["components"] = {
	a: ({ href, onClick, ...props }) => {
		return (
			<a
				href={href}
				onClick={(e) => {
					e.preventDefault();
					href && handleCitation(href);
				}}
				{...props}
			/>
		);
	},
};
