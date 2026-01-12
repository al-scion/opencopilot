import { Crons } from "@convex-dev/crons";
import { cronJobs } from "convex/server";
import { v } from "convex/values";
import { components, internal } from "./_generated/api";
import { internalMutation } from "./_generated/server";

export const logger = internalMutation({
	args: { message: v.string() },
	handler: async (ctx, args) => {
		console.log(args.message);
		return { success: true };
	},
});

const dynamicCron = new Crons(components.crons);

const crons = cronJobs();

crons.daily("status", { hourUTC: 0, minuteUTC: 0 }, internal.crons.logger, { message: "Hello, world!" });

export default crons;
