import { Globe, Unplug } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { TooltipButton } from "../tooltip-button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Switch } from "../ui/switch";

export function ToolMenu() {
	const [webSearch, setWebSearch] = useState(false);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={(props, state) => (
					<TooltipButton
						className={cn(state.open && "bg-muted")}
						size="icon"
						tooltip="Integrations"
						variant="ghost"
						{...props}
						{...state}
					/>
				)}
			>
				<Unplug />
			</DropdownMenuTrigger>
			<DropdownMenuContent align="center" className="w-44 min-w-fit">
				<DropdownMenuGroup>
					<DropdownMenuLabel>Select integrations</DropdownMenuLabel>
					<DropdownMenuItem
						className="items-center"
						closeOnClick={false}
						onClick={() => setWebSearch(!webSearch)}
					>
						<Globe />
						Web Search
						<DropdownMenuShortcut>
							<Switch checked={webSearch} onCheckedChange={setWebSearch} />
						</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
