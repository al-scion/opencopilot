import type { excelTools } from "@packages/shared";
import type { ChatOnToolCallCallback, InferToolInput, InferToolOutput } from "ai";
// import { uploadImage } from "@/lib/server";
import { jsonToMarkdownTable } from "./markdown";
import { NUMBER_FORMATS } from "./style";

export type ToolCall = Parameters<ChatOnToolCallCallback>[0]["toolCall"];

export const excelToolHandler = async (toolCall: ToolCall) => {
	const toolName = toolCall.toolName as keyof typeof excelTools;

	if (toolName === "editRange") {
		const input = toolCall.input as InferToolInput<typeof excelTools.editRange>;
		return await Excel.run(
			{ delayForCellEdit: true, mergeUndoGroup: true },
			async (context): Promise<InferToolOutput<typeof excelTools.editRange>> => {
				const range = context.workbook.worksheets.getItem(input.worksheet).getRange(input.address);
				// const numberFormat = input.numberFormats.map((row) => row.map((format) => NUMBER_FORMATS[format]));
				range.set({ values: input.values });
				range.load({ text: true });
				await context.sync();
				const result = jsonToMarkdownTable(range.text);
				return { result };
			}
		);
	}

	if (toolName === "formatRange") {
		const input = toolCall.input as InferToolInput<typeof excelTools.formatRange>;
		return await Excel.run({ delayForCellEdit: true, mergeUndoGroup: true }, async (context) => {
			const range = context.workbook.worksheets.getItem(input.worksheet).getRange(input.address);
			range.set({ format: input.format });
			input.borders?.forEach((item) => {
				range.format.borders.getItem(item.sideIndex).set({
					color: item.color,
					style: item.style,
					weight: item.weight,
				});
			});
			await context.sync();
			return { success: true };
		});
	}

	if (toolName === "copyPaste") {
		const input = toolCall.input as InferToolInput<typeof excelTools.copyPaste>;
		return await Excel.run({ delayForCellEdit: true, mergeUndoGroup: true }, async (context) => {
			const source = context.workbook.worksheets.getItem(input.source.worksheet).getRange(input.source.address);
			const target = context.workbook.worksheets
				.getItem(input.destination.worksheet)
				.getRange(input.destination.address);
			target.copyFrom(source);
			target.load({ values: true, address: true, text: true });
			await context.sync();
			const result = jsonToMarkdownTable(target.text);

			return { address: target.address, result };
		});
	}

	if (toolName === "editRowsOrColumns") {
		const input = toolCall.input as InferToolInput<typeof excelTools.editRowsOrColumns>;
		return await Excel.run({ delayForCellEdit: true, mergeUndoGroup: true }, async (context) => {
			const range = context.workbook.worksheets.getItem(input.worksheet).getRange(input.address);
			switch (input.action) {
				case "insertRow":
					range.getEntireRow().insert("Down");
					break;
				case "deleteRow":
					range.getEntireRow().delete("Up");
					break;
				case "insertColumn":
					range.getEntireColumn().insert("Right");
					break;
				case "deleteColumn":
					range.getEntireColumn().delete("Left");
					break;
				default:
					throw new Error(`Invalid action: ${input.action}`);
			}
			return { success: true };
		});
	}

	if (toolName === "writeComment") {
		const input = toolCall.input as InferToolInput<typeof excelTools.writeComment>;
		return await Excel.run({ delayForCellEdit: true, mergeUndoGroup: true }, async (context) => {
			const worksheet = context.workbook.worksheets.getItem(input.worksheet);
			worksheet.comments.add(input.address, input.comment);
			await context.sync();
		});
	}

	if (toolName === "clearRange") {
		const input = toolCall.input as InferToolInput<typeof excelTools.clearRange>;
		return await Excel.run({ delayForCellEdit: true, mergeUndoGroup: true }, async (context) => {
			context.workbook.worksheets.getItem(input.worksheet).getRange(input.address).clear("All");
			return { success: true };
		});
	}

	if (toolName === "createWorksheet") {
		const input = toolCall.input as InferToolInput<typeof excelTools.createWorksheet>;
		return await Excel.run({ delayForCellEdit: true, mergeUndoGroup: true }, async (context) => {
			if (input.copyFrom) {
				context.workbook.worksheets.getItem(input.copyFrom).copy().set({ name: input.name });
			} else {
				context.workbook.worksheets.add(input.name);
			}
			return { success: true };
		});
	}

	if (toolName === "readWorksheet") {
		const input = toolCall.input as InferToolInput<typeof excelTools.readWorksheet>;
		return await Excel.run({ delayForCellEdit: true }, async (context) => {
			const worksheet = context.workbook.worksheets.getItem(input.worksheet);
			const range = input.address ? worksheet.getRange(input.address) : worksheet.getUsedRange(true);
			range.load({ text: true, address: true });
			await context.sync();
			const result = jsonToMarkdownTable(range.text);
			return { address: range.address, result };
		});
	}

	if (toolName === "getScreenshot") {
		const input = toolCall.input as InferToolInput<typeof excelTools.getScreenshot>;
		return await Excel.run(
			{ delayForCellEdit: true },
			async (context): Promise<InferToolOutput<typeof excelTools.getScreenshot>> => {
				const worksheet = context.workbook.worksheets.getItem(input.worksheet);
				const range = input.address ? worksheet.getRange(input.address) : worksheet.getUsedRange(true);
				const screenshot = range.getImage();
				await context.sync();
				// const url = await uploadImage(screenshot.value);
				return { url: "" };
			}
		);
	}

	if (toolName === "searchWorkbook") {
		const input = toolCall.input as InferToolInput<typeof excelTools.searchWorkbook>;
		return await Excel.run({ delayForCellEdit: true }, async (context) => {
			const worksheets = context.workbook.worksheets.load();
			await context.sync();
			const worksheetsToSearch = input.worksheet
				? [context.workbook.worksheets.getItem(input.worksheet)]
				: worksheets.items;

			const results = worksheetsToSearch.map((worksheet) => worksheet.findAll(input.query, {}).areas.load());
			await context.sync();
			const resultsRange = results.flatMap((range) =>
				range.items.map((range) => range.load({ address: true, values: true }))
			);
			await context.sync();

			const resultsWithSurroundingRegion = resultsRange.map((range) => {
				const region = range.getSurroundingRegion().load({ address: true, values: true });
				return {
					range,
					region,
				};
			});

			await context.sync();

			return resultsWithSurroundingRegion.map(({ range, region }) => ({
				range: { address: range.address, values: range.values },
				region: { address: region.address, values: region.values },
			}));
		});
	}

	if (toolName === "editWorksheet") {
		const input = toolCall.input as InferToolInput<typeof excelTools.editWorksheet>;
		return await Excel.run({ delayForCellEdit: true, mergeUndoGroup: true }, async (context) => {
			const worksheet = context.workbook.worksheets.getItem(input.name).load({});

			worksheet.set({
				position: input.position,
				...(input.rename !== undefined && { name: input.rename }),
				...(input.color !== undefined && { color: input.color }),
			});
		});
	}

	if (toolName === "evaluateFormula") {
		const input = toolCall.input as InferToolInput<typeof excelTools.evaluateFormula>;
		return await Excel.run({ delayForCellEdit: true }, async (context) => {
			const worksheet = context.workbook.worksheets.getItem(input.worksheet).copy();
			const range = worksheet.getRange(input.range);
			range.set({ values: input.formula });
			range.load({ values: true });
			worksheet.delete();
			await context.sync();
			return range.values;
		});
	}

	if (toolName === "traceFormula") {
		const input = toolCall.input as InferToolInput<typeof excelTools.traceFormula>;
		return await Excel.run({ delayForCellEdit: true }, async (context) => {
			const range = context.workbook.worksheets
				.getItem(input.worksheet)
				.getRange(input.address)
				.load({ formulas: true, values: true });

			const precedents = range.getDirectPrecedents().areas.load();
			await context.sync();
			const areas = precedents.items.map((area) => area.areas.load());
			await context.sync();
			const results = areas.flatMap((area) =>
				area.items.map((range) => range.load({ address: true, values: true, formulas: true }))
			);
			await context.sync();

			return {
				targetFormula: range.formulas[0]![0],
				targetValue: range.values[0]![0],
				precendents: results.map((range) => ({
					address: range.address,
					values: range.values,
					formulas: range.formulas,
				})),
			};
		});
	}
};
