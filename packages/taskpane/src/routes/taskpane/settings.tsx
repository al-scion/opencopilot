import { languageModelRegistry, providerRegistry } from "@packages/shared";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@packages/ui/components/ui/accordion";
import { Card, CardContent, CardContentItem, CardHeader } from "@packages/ui/components/ui/card";
import { Input } from "@packages/ui/components/ui/input";
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
	const availableModels = Object.keys(languageModelRegistry) as (keyof typeof languageModelRegistry)[];
	const availableProviders = Object.keys(providerRegistry) as (keyof typeof providerRegistry)[];

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

			<Tabs defaultValue={options[0]!.value}>
				<TabsList className="ring-[0.5px] ring-border" indicatorClassName="ring-[0.5px] ring-border">
					{options.map(({ value, label }) => (
						<TabsTrigger key={value} value={value}>
							{label}
						</TabsTrigger>
					))}
				</TabsList>
				<TabsPanel className="mt-1 flex flex-col gap-3" value="general">
					<Card>
						<CardHeader className="px-3 py-1.5">Preferences</CardHeader>
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
					<Card>
						<CardHeader className="px-3 py-1.5">Billing</CardHeader>
						<CardContent>
							<CardContentItem className="px-3">
								<div className="flex flex-col">
									<span>Plan</span>
									<span className="font-light text-muted-foreground text-xs">Launch automatically on startup</span>
								</div>
							</CardContentItem>
							<CardContentItem className="px-3">
								<div className="flex flex-col">
									<span>Invoices</span>
									<span className="font-light text-muted-foreground text-xs">Launch automatically on startup</span>
								</div>
							</CardContentItem>
						</CardContent>
					</Card>
				</TabsPanel>
				<TabsPanel className="mt-1 flex flex-col gap-3" value="models">
					<Card>
						<CardHeader className="px-3 py-1.5">Models</CardHeader>
						<CardContent>
							{availableModels.map((model) => {
								const languageModel = languageModelRegistry[model];
								const provider = providerRegistry[languageModel.provider];
								return (
									<CardContentItem className="px-3 py-2" key={model}>
										<span>{languageModel.name}</span>
										<Switch className="ml-auto" />
									</CardContentItem>
								);
							})}
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="px-3 py-1.5">Providers</CardHeader>
						<CardContent>
							{Object.values(providerRegistry).map((provider) => (
								<CardContentItem className="p-0" key={provider.name}>
									<Accordion className="w-full">
										<AccordionItem>
											<AccordionTrigger className="gap-3 px-3 py-2 hover:bg-muted" showIcon={true}>
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
				<TabsPanel className="mt-1 flex flex-col gap-3" value="styles">
					<Card>
						<CardContent>
							<CardContentItem className="px-3">
								<div className="flex flex-col">
									<span className="">Auto format</span>
									<span className="font-light text-muted-foreground text-xs">Launch automatically on startup</span>
								</div>
								<Switch checked={loadOnStartup} className="ml-auto" onCheckedChange={handleLoadBehaviourChange} />
							</CardContentItem>
						</CardContent>
					</Card>
				</TabsPanel>
			</Tabs>
		</div>
	);
}
