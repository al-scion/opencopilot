import { PixelGrid } from "@packages/ui/components/pixel-grid";
import { Button } from "@packages/ui/components/ui/coss-button";
import { Group, GroupSeparator } from "@packages/ui/components/ui/group";
import { Menu, MenuItem, MenuPopup, MenuTrigger } from "@packages/ui/components/ui/menu";
import { Separator } from "@packages/ui/components/ui/separator";
import { Link } from "@tanstack/react-router";
import { ChevronDownIcon } from "lucide-react";

export function Header({ excelUrl }: { excelUrl: string }) {
	return (
		<>
			<header className="sticky top-0 z-20 flex h-14 w-full max-w-full shrink-0 flex-row items-center border-b bg-background">
				<div className="mx-3 flex h-full w-full border-x md:mx-8 lg:mx-12">
					<nav className="flex w-full flex-row items-center justify-between gap-4 px-4 py-3 md:mx-auto md:max-w-7xl md:px-6">
						{/* Left section - Logo */}
						<div className="flex flex-1 items-center">
							<img className="size-7" src={"./favicon.svg"} />
						</div>
						{/* Middle section - Navigation */}
						<div className="flex flex-none items-center gap-1">
							<Button variant="ghost">Product</Button>
							<Button variant="ghost">Pricing</Button>
							<Button variant="ghost">Resources</Button>
							<Link to="/docs/$">
								<Button variant="ghost">Docs</Button>
							</Link>
						</div>
						{/* Right section - Actions */}
						<div className="flex flex-1 items-center justify-end gap-2">
							<Button variant="ghost">Sign In</Button>
							<Button render={<a href={excelUrl} />} variant="default">
								Download
							</Button>
						</div>
					</nav>
				</div>
			</header>
			<div className="mx-3 flex grow flex-col items-center border-x md:mx-8 lg:mx-12">
				<section className="relative w-full overflow-hidden p-4 md:p-12">
					{/* Section content */}
					<div className="relative z-10 mx-auto flex w-full flex-col items-center justify-center gap-3 py-12 md:max-w-7xl">
						<h1 className="text-balance text-center font-serif text-5xl">The AI Office Workspace</h1>
						<p className="text-balance text-center text-lg">
							Fabric brings the full power of frontier AI models to where you work
						</p>
						<div className="mt-2 flex flex-row items-center gap-2">
							<Group aria-label="Subscription actions">
								<Button render={<a href={excelUrl} />} size="lg">
									Install for Excel
								</Button>
								<GroupSeparator className="bg-primary/75" />
								<Menu>
									<MenuTrigger render={<Button size="icon-lg" />}>
										<ChevronDownIcon />
									</MenuTrigger>
									<MenuPopup align="end" className="w-41">
										<MenuItem className="h-8 gap-3">
											<img className="size-4" src="/assets/powerpoint.svg" />
											<span className="text-base">Powerpoint</span>
										</MenuItem>
										<MenuItem className="h-8 gap-3">
											<img className="size-4" src="/assets/word.svg" />
											<span className="text-base">Word</span>
										</MenuItem>
									</MenuPopup>
								</Menu>
							</Group>
							<Button size="lg" variant="outline">
								Request demo
							</Button>
						</div>
						<div
							className="relative mt-16 flex w-full items-center justify-center rounded-xl bg-center bg-cover bg-no-repeat p-8"
							style={{ backgroundImage: 'url("./assets/backdrop-1.jpeg")', height: "min(70vh, 700px)" }}
						>
							<img className="max-h-full max-w-full rounded-xl object-contain" src="/assets/showcase.png" />
						</div>
					</div>
					{/* Section mask */}
					<div className="mask-t-to-50% absolute inset-0 h-full w-full">
						<PixelGrid className="opacity-50" fillContainer />
					</div>
				</section>

				<div className="relative">
					<div className="absolute left-1/2 w-screen -translate-x-1/2 border-t" />
				</div>

				{/* <section className="px-4 py-3 md:mx-auto md:max-w-7xl md:px-6" /> */}
			</div>
		</>
	);
}
