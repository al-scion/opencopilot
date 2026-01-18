import { Card, CardContent, CardContentItem } from "@packages/ui/components/ui/card";
import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "@packages/ui/components/ui/select";
import { Switch } from "@packages/ui/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@packages/ui/components/ui/tabs";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ChevronLeftIcon } from "lucide-react";
import { TooltipButton } from "@/components/tooltip-button";
import { useAppState } from "@/lib/state";

export const Route = createFileRoute("/taskpane/settings")({
	component: RouteComponent,
});

const options = [
	{ label: "General", value: "general" },
	{ label: "Models", value: "models" },
];

function RouteComponent() {
	const router = useRouter();

	const { workbookConfig, setWorkbookConfig } = useAppState();

	const handleBack = () => {
		router.navigate({ to: "/taskpane" });
	};

	const handleLoadBehaviourChange = (checked: boolean) => {
		setWorkbookConfig({ loadOnStartup: checked });
		Office.addin.setStartupBehavior(checked ? Office.StartupBehavior.load : Office.StartupBehavior.none);
	};

	return (
		<div className="flex flex-col gap-3 p-2">
			<div className="flex flex-row items-center gap-1">
				<TooltipButton onClick={handleBack} size="icon" variant="ghost">
					<ChevronLeftIcon className="text-foreground" />
				</TooltipButton>
				<h1 className="font-normal text-md">Settings</h1>
			</div>

			{/* <Select defaultValue={options[0].value} items={options}>
				<SelectTrigger className="rounded-md" size="sm">
					<SelectValue className="text-sm" />
				</SelectTrigger>
				<SelectPopup alignItemWithTrigger={false}>
					{options.map(({ value, label }) => (
						<SelectItem key={value} value={value}>
							<span className="font-normal text-sm">{label}</span>
						</SelectItem>
					))}
				</SelectPopup>
			</Select> */}

			<Tabs defaultValue={options[0].value}>
				<TabsList className="rounded-md p-0" variant="default">
					{options.map(({ value, label }) => (
						<TabsTrigger className={"h-7 px-1.5 font-normal text-sm"} key={value} value={value}>
							{label}
						</TabsTrigger>
					))}
				</TabsList>
			</Tabs>

			<Card>
				<CardContent>
					<CardContentItem className="px-3">
						<div className="flex flex-col">
							<span className="">Load behaviour</span>
							<span className="font-light text-muted-foreground text-xs">Launch automatically on startup</span>
						</div>
						<Switch
							checked={workbookConfig.loadOnStartup}
							className="ml-auto"
							onCheckedChange={handleLoadBehaviourChange}
						/>
					</CardContentItem>
				</CardContent>
			</Card>
		</div>
	);
}
