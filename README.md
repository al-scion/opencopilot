# Fabric

An AI-powered spreadsheet agent built as a plugin for Microsoft Excel.

## Overview

Fabric is a monorepo project that provides AI-driven spreadsheet functionality through:

- **Excel Task Pane Add-in** - A web-based plugin that runs inside Microsoft Excel
- **Web Application** - A standalone web app for browser-based access
- **Backend Services** - Convex-powered backend with WorkOS authentication
- **API Layer** - Hono-based API on Cloudflare Workers

## Project Structure

```text
fabric/
├── packages/
│   ├── app/             # Web application (React + Vite)
│   ├── taskpane/        # Microsoft Excel task pane add-in (React)
│   ├── cloud/           # API backend (Hono on Cloudflare Workers)
│   ├── convex/          # Backend database and functions
│   ├── console/         # Admin console API
│   ├── shared/          # Shared code and utilities
│   ├── ui/              # Shared React UI components
│   └── website/         # Marketing website (Astro)
└── install              # CLI installation script
```

## Quick Start

### Prerequisites

- [Bun](https://bun.sh) v1.3.6+

### Installation

```bash
# Clone the repository
git clone https://github.com/al-scion/opencopilot.git
cd opencopilot

# Note: The project is named "Fabric", but the repository is "opencopilot".

# Install dependencies
bun install

# Start development
bun run dev
```

## Excel Task Pane Add-in

The Excel add-in provides AI spreadsheet capabilities directly in Microsoft Excel.

### Development

```bash
cd packages/taskpane

# Start dev server with HTTPS (required for Office)
bun run dev
```

### Deployment

```bash
# Deploy to Cloudflare Workers
bun run deploy
```

## Web Application

The web app provides browser-based access to Fabric's AI spreadsheet features.

### Development

```bash
cd packages/app

# Start dev server
bun run dev

# Build for production
bun run build

# Deploy to Cloudflare
bun run deploy
```

## Technology Stack

### Frontend
- **React 19** with [React Compiler](https://react.dev/learn/react-compiler)
- **TanStack Router** for routing
- **TanStack Query** for data fetching
- **Tailwind CSS v4** for styling
- **Tiptap** for rich text editing
- **Base UI** for accessible components

### Backend
- **Convex** for database and real-time functions
- **Hono** for API routing
- **WorkOS** for authentication
- **AI SDK** (Vercel) with Anthropic/OpenAI/Google providers

### Website
- **Astro** for static site generation
- **Cloudflare** for hosting

### Tooling
- **Bun** for package management and runtime
- **Ultracite** (Biome/Oxlint) for linting and formatting
- **Turbo** for monorepo orchestration
- **Knip** for dead code detection
- **Lefthook** for git hooks
- **tsgo** (TypeScript native preview) for type checking

## Code Quality

This project uses [Ultracite](https://github.com/stackblitz/ultracite) for strict code quality enforcement:

```bash
# Format and fix issues
bun x ultracite fix

# Check for issues
bun x ultracite check

# Diagnose setup
bun x ultracite doctor
```

See [AGENTS.md](./AGENTS.md) for detailed code standards.

## Scripts

### Root Level

```bash
bun run dev        # Start all packages in dev mode
bun run checktypes # Type check all packages
bun run knip       # Check for unused dependencies
bun run lint       # Check for linting issues
bun run lint:fix   # Fix linting issues
```

### Package Scripts

Each package supports:

```bash
bun run dev        # Start dev server
bun run build      # Build for production
bun run checktypes # Type check
bun run deploy     # Deploy to Cloudflare
```

## Contributing

1. Create a feature branch from `main`
2. Make your changes following [code standards](./AGENTS.md)
3. Run `bun x ultracite fix` before committing
4. Push and create a pull request

## Resources

- [Office Add-ins Documentation](https://learn.microsoft.com/en-us/office/dev/add-ins/)
- [Convex Documentation](https://docs.convex.dev/)
- [Bun Documentation](https://bun.sh/docs)
- [Hono Documentation](https://hono.dev/)
- [Astro Documentation](https://astro.build/)

---

Built with Bun, React, Convex, and Hono.
