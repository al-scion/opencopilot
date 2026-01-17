import { Button } from "@packages/ui/components/ui/button";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
import { useAuth } from "@workos-inc/authkit-react";
import { useState } from "react";
import { signInWithDialog } from "@/lib/auth";
import { useAppState } from "@/lib/state";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/taskpane/sign-in")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		// if (context.auth.user !== null) {
		// 	throw redirect({ to: "/taskpane" });
		// }
	},
});

const features = [
	{
		number: "01",
		title: "Build models faster",
		description: "Describe what you need, watch it appear.",
	},
	{
		number: "02",
		title: "Catch errors early",
		description: "AI spots formula issues before they spread.",
	},
	{
		number: "03",
		title: "Explain any cell",
		description: "Understand complex formulas instantly.",
	},
	{
		number: "04",
		title: "Format beautifully",
		description: "Professional styling in one command.",
	},
];

function RouteComponent() {
	const { workbookConfig } = useAppState();
	const officePlatform = workbookConfig.officePlatform;
	const { signIn } = useAuth();
	const handleSignIn = async () => {
		if (officePlatform === "web") {
			signInWithDialog();
			return;
		}

		signIn({});
	};

	return (
		<div
			className={cn(
				"flex h-screen w-screen bg-taskpane-background p-1.5",
				officePlatform === "mac" && "bg-taskpane-background-mac",
				officePlatform === "web" && "bg-taskpane-background-web",
				officePlatform === "windows" && "bg-taskpane-background-windows"
			)}
		>
			<div className="relative flex w-full flex-col overflow-hidden rounded-lg bg-linear-to-b from-stone-50 to-white">
				{/* Decorative background pattern */}
				<div className="pointer-events-none absolute inset-0 opacity-[0.03]">
					<svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
						<defs>
							<pattern height="32" id="grid" patternUnits="userSpaceOnUse" width="32">
								<path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="1" />
							</pattern>
						</defs>
						<rect fill="url(#grid)" height="100%" width="100%" />
					</svg>
				</div>
				{/* {JSON.stringify(auth, null, 2)} */}

				{/* Content */}
				<div className="relative z-10 flex flex-1 flex-col items-center px-6 pt-12 pb-8">
					{/* Logo */}
					<div className="mb-8 flex items-center justify-center">
						<div className="relative flex size-16 items-center justify-center rounded-2xl bg-stone-900 shadow-lg shadow-stone-900/20">
							<svg className="size-10" viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">
								<g transform="translate(75, 75)">
									<rect fill="none" height="80" rx="8" stroke="#fff" strokeWidth="4" width="80" x="-40" y="-40" />
									<rect
										fill="none"
										height="56"
										rx="6"
										stroke="#fff"
										strokeWidth="4"
										transform="rotate(15)"
										width="56"
										x="-28"
										y="-28"
									/>
									<rect fill="#fff" height="32" rx="4" transform="rotate(30)" width="32" x="-16" y="-16" />
								</g>
							</svg>
						</div>
					</div>

					{/* Headline */}
					<h1
						className="mb-2 text-center font-medium font-serif text-3xl text-stone-900 tracking-tight"
						style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
					>
						Fabric
					</h1>
					<p className="mb-8 max-w-[220px] text-center text-sm text-stone-500 leading-relaxed">
						AI-powered spreadsheet intelligence, right in Excel.
					</p>

					{/* Sign In Button */}
					<Button
						className="mb-10 h-11 w-full max-w-[240px] rounded-xl bg-stone-900 font-medium text-sm text-white shadow-md shadow-stone-900/10 transition-all hover:bg-stone-800 hover:shadow-lg"
						onClick={handleSignIn}
					>
						Sign in to get started
					</Button>

					{/* Features */}
					<div className="w-full max-w-[280px] space-y-4">
						{features.map((feature) => (
							<div className="flex gap-3" key={feature.number}>
								<span className="mt-0.5 font-medium font-mono text-stone-300 text-xs">{feature.number}</span>
								<div className="flex-1">
									<h3 className="font-medium text-sm text-stone-800">{feature.title}</h3>
									<p className="text-stone-400 text-xs leading-relaxed">{feature.description}</p>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Footer */}
				<div className="relative z-10 border-stone-100 border-t py-4 text-center">
					<a
						className="text-stone-400 text-xs transition-colors hover:text-stone-600"
						href="https://usefabric.dev"
						rel="noopener noreferrer"
						target="_blank"
					>
						Learn more at <span className="font-medium text-stone-500">usefabric.dev</span>
					</a>
				</div>
			</div>
		</div>
	);
}
