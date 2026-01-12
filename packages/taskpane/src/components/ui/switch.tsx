import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { cn } from "@/lib/utils";

function Switch({ className, thumbClassName, ...props }: SwitchPrimitive.Root.Props & { thumbClassName?: string }) {
	return (
		<SwitchPrimitive.Root
			className={cn(
				"group/switch inset-shadow-[0_1px_--theme(--color-black/4%)] inline-flex h-4.5 w-7.5 shrink-0 items-center rounded-full p-px outline-none transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background data-checked:bg-primary data-unchecked:bg-input data-disabled:opacity-64",
				"cursor-pointer",
				className
			)}
			data-slot="switch"
			{...props}
		>
			<SwitchPrimitive.Thumb
				className={cn(
					"pointer-events-none block size-4 rounded-full bg-background shadow-sm transition-[translate,width] group-active/switch:not-data-disabled:w-4.5 data-checked:translate-x-3 data-unchecked:translate-x-0 data-checked:group-active/switch:translate-x-2.5",
					thumbClassName
				)}
				data-slot="switch-thumb"
			/>
		</SwitchPrimitive.Root>
	);
}

export { Switch };
