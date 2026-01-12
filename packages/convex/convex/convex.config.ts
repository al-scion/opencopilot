import crons from "@convex-dev/crons/convex.config";
import r2 from "@convex-dev/r2/convex.config";
import workflow from "@convex-dev/workflow/convex.config";
import { defineApp } from "convex/server";

const app = defineApp() as ReturnType<typeof defineApp>;

app.use(r2);
app.use(crons);
app.use(workflow);

export default app;
