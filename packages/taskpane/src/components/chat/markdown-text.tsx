import { handleCitation } from "@packages/shared";
import { cn } from "@packages/ui/lib/utils";
import { Streamdown, type StreamdownProps } from "streamdown";

export function MarkdownText({ children, components, className, ...props }: StreamdownProps) {
	return (
		<Streamdown className={cn("", className)} components={streamdownComponents} {...props}>
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
