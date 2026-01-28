import browserCollections from "fumadocs-mdx:collections/browser";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useFumadocsLoader } from "fumadocs-core/source/client";
import { DocsLayout, type DocsLayoutProps } from "fumadocs-ui/layouts/docs";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/layouts/docs/page";
import defaultMdxComponents from "fumadocs-ui/mdx";
import { source } from "../../lib/source";

// Route definition
export const Route = createFileRoute("/docs/$")({
	component: Page,
	loader: async ({ params }) => {
		const slugs = params._splat?.split("/") ?? [];
		const data = await serverLoader({ data: slugs });
		await clientLoader.preload(data.path);
		return data;
	},
});

// Server loader
const serverLoader = createServerFn({
	method: "GET",
})
	.inputValidator((slugs: string[]) => slugs)
	.handler(async ({ data: slugs }) => {
		const page = source.getPage(slugs);
		if (!page) {
			throw redirect({ href: "/docs" });
		}

		return {
			path: page.path,
			pageTree: await source.serializePageTree(source.getPageTree()),
		};
	});

const clientLoader = browserCollections.docs.createClientLoader({
	component({ toc, frontmatter, default: MDX }, props: { className?: string }) {
		return (
			<DocsPage toc={toc} {...props}>
				<DocsTitle>{frontmatter.title}</DocsTitle>
				<DocsDescription>{frontmatter.description}</DocsDescription>
				<DocsBody>
					<MDX components={{ ...defaultMdxComponents }} />
				</DocsBody>
			</DocsPage>
		);
	},
});

function getDocsLayoutProps(): Omit<DocsLayoutProps, "tree"> {
	return {
		sidebar: {
			enabled: true,
			collapsible: false,
			tabs: false,
			footer: undefined,
		},
		githubUrl: "https://github.com/tanstack/start",
	};
}

function Page() {
	const { path, pageTree } = Route.useLoaderData();
	const Content = clientLoader.getComponent(path);
	const fumadocs = useFumadocsLoader({ pageTree });
	const docsLayoutProps = getDocsLayoutProps();

	return (
		<DocsLayout tree={fumadocs.pageTree} {...docsLayoutProps}>
			<Content />
		</DocsLayout>
	);
}
