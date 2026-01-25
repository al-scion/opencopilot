import { providerRegistry } from "@packages/shared";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@packages/ui/components/ui/accordion";
import { Card, CardContent, CardContentItem, CardHeader } from "@packages/ui/components/ui/card";
import { Input } from "@packages/ui/components/ui/input";
// import { Select, SelectItem, SelectPopup, SelectTrigger, SelectValue } from "@packages/ui/components/ui/select";
import { Switch } from "@packages/ui/components/ui/switch";
import { Tabs, TabsList, TabsPanel, TabsTrigger } from "@packages/ui/components/ui/tabs";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { ArrowLeftIcon } from "lucide-react";
import { useState } from "react";
import { TooltipButton } from "@/components/tooltip-button";

export const Route = createFileRoute("/taskpane/settings")({
	component: RouteComponent,
	loader: async () => {
		const startupBehavior = await Office.addin.getStartupBehavior();
		const loadOnStartup = startupBehavior === Office.StartupBehavior.load;
		return { loadOnStartup };
	},
});

const options = [
	{ label: "General", value: "general" },
	{ label: "Models", value: "models" },
	{ label: "Styles", value: "styles" },
];

function RouteComponent() {
	const router = useRouter();

	const [loadOnStartup, setLoadOnStartup] = useState<boolean>(Route.useLoaderData().loadOnStartup);
	const handleLoadBehaviourChange = (checked: boolean) => {
		setLoadOnStartup(checked);
		Office.addin.setStartupBehavior(checked ? Office.StartupBehavior.load : Office.StartupBehavior.none);
	};

	const handleBack = () => {
		router.navigate({ to: "/taskpane" });
	};

	return (
		<div className="flex flex-col gap-3 p-2">
			<div className="flex flex-row items-center gap-1">
				<TooltipButton onClick={handleBack} size="icon" variant="ghost">
					<ArrowLeftIcon className="size-3.5 text-foreground" />
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

			<Tabs defaultValue={options[0]!.value}>
				<TabsList variant="default">
					{options.map(({ value, label }) => (
						<TabsTrigger key={value} value={value}>
							{label}
						</TabsTrigger>
					))}
				</TabsList>
				<TabsPanel value="general">
					<Card>
						<CardContent>
							<CardContentItem className="px-3">
								<div className="flex flex-col">
									<span className="">Load behaviour</span>
									<span className="font-light text-muted-foreground text-xs">Launch automatically on startup</span>
								</div>
								<Switch checked={loadOnStartup} className="ml-auto" onCheckedChange={handleLoadBehaviourChange} />
							</CardContentItem>
						</CardContent>
					</Card>
				</TabsPanel>
				<TabsPanel value="models">
					<Card>
						<CardHeader className="px-3 py-1.5">Providers</CardHeader>
						<CardContent>
							{Object.values(providerRegistry).map((provider) => (
								<CardContentItem className="p-0" key={provider.name}>
									<Accordion className="w-full">
										<AccordionItem>
											<AccordionTrigger className="gap-3 px-3 py-2 hover:bg-muted">
												<div
													aria-label={provider.name}
													className="h-4 w-4 bg-muted-foreground"
													role="img"
													style={{
														maskImage: `url(${provider.iconUrl})`,
														maskSize: "contain",
														maskRepeat: "no-repeat",
														maskPosition: "center",
														WebkitMaskImage: `url(${provider.iconUrl})`,
														WebkitMaskSize: "contain",
														WebkitMaskRepeat: "no-repeat",
														WebkitMaskPosition: "center",
													}}
												/>
												<span>{provider.name}</span>
											</AccordionTrigger>
											<AccordionContent className="p-2">
												<Input
													className="rounded-md font-normal text-foreground text-xs shadow-none"
													onChange={(e) => console.log(e.target.value)}
													placeholder={`${provider.apiKeyPrefix}********************`}
													type="password"
												/>
											</AccordionContent>
										</AccordionItem>
									</Accordion>
								</CardContentItem>
							))}
						</CardContent>
					</Card>
				</TabsPanel>
			</Tabs>
		</div>
	);
}
