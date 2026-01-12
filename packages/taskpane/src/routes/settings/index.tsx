import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardContentItem, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useAppState } from "@/lib/state";

export const Route = createFileRoute("/settings/")({
	component: RouteComponent,
});

function RouteComponent() {
	// const { autoLoad } = useRouteContext({ from: Route.id });
	// const [autoLoadEnabled, setAutoLoadEnabled] = useState(false);
	// const handleAutoLoadChange = async (checked: boolean) => {
	// 	setAutoLoadEnabled(checked);
	// 	await Office.addin.setStartupBehavior(checked ? Office.StartupBehavior.load : Office.StartupBehavior.none);
	// 	console.log(await Office.addin.getStartupBehavior());
	// };
	const { workbookConfig, setWorkbookConfig } = useAppState();
	const handleLoadBehaviourChange = (checked: boolean) => {
		setWorkbookConfig({ loadOnStartup: checked });
	};

	return (
		<>
			<h1 className="font-medium text-lg">Preferences</h1>
			<Card>
				<CardContent>
					<CardContentItem className="px-3.5">
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
		</>
	);
}
