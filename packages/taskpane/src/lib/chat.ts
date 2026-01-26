import { Chat } from "@ai-sdk/react";
import { getOfficeMetadata, type UIMessageType } from "@packages/shared";
import { DefaultChatTransport, lastAssistantMessageIsCompleteWithToolCalls } from "ai";
import { getAccessToken } from "@/lib/auth";
import { getWorkbookState } from "@/lib/excel/workbook-state";
import { server } from "@/lib/server";
import { useAgentConfig } from "@/lib/state";

export const createChat = ({ id = crypto.randomUUID(), messages = [] }: { id?: string; messages?: any[] } = {}) => {
	const serverUrl = server.chat.$url().href;
	const transport = new DefaultChatTransport({
		api: serverUrl,
		headers: () => ({
			Authorization: `Bearer ${getAccessToken()}`,
		}),
		body: async () => ({
			agentConfig: useAgentConfig.getState(),
			workbookState: await getWorkbookState(),
			officeMetadata: getOfficeMetadata(),
		}),
		credentials: "include",
	});

	const chat = new Chat<UIMessageType>({
		id,
		messages,
		transport,
		generateId: () => crypto.randomUUID(),
		sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
		onError: (error) => console.error(error),
		onToolCall: async ({ toolCall }) => {
			if (toolCall.dynamic) {
				return;
			}

			try {
				console.log("Executing client tool call");
				const { toolName, input, toolCallId } = toolCall;
				if (toolName === "readWorksheet") {
					await Excel.run({ delayForCellEdit: true }, async (context) => {
						const worksheet = context.workbook.worksheets.getItem(input.worksheet);
						const range = input.address ? worksheet.getRange(input.address) : worksheet.getUsedRange(true);
						range.load({ text: true, formulas: true });
						await context.sync();

						chat.addToolOutput({
							tool: toolName,
							toolCallId,
							output: {
								formulas: range.formulas,
								text: range.text,
							},
						});
					});
					return;
				}

				if (toolName === "copyPaste") {
					await Excel.run({ delayForCellEdit: true, mergeUndoGroup: true }, async (context) => {
						const source = context.workbook.worksheets.getItem(input.source.worksheet).getRange(input.source.address);
						const target = context.workbook.worksheets
							.getItem(input.destination.worksheet)
							.getRange(input.destination.address);
						target.copyFrom(source);
						target.load({ address: true, text: true });
						await context.sync();
						chat.addToolOutput({
							tool: toolName,
							toolCallId,
							output: {
								address: target.address,
								values: target.text,
							},
						});
					});
					return;
				}

				if (toolName === "clearRange") {
					await Excel.run({ delayForCellEdit: true, mergeUndoGroup: true }, async (context) => {
						context.workbook.worksheets.getItem(input.worksheet).getRange(input.address).clear("All");
						chat.addToolOutput({
							tool: toolName,
							toolCallId,
							output: {
								success: true,
							},
						});
					});
					return;
				}

				if (toolName === "writeComment") {
					await Excel.run({ delayForCellEdit: true, mergeUndoGroup: true }, async (context) => {
						const worksheet = context.workbook.worksheets.getItem(input.worksheet);
						const range = worksheet.getRange(input.address).load({ address: true });
						const comments = worksheet.comments.load({ expand: "replies" });
						await context.sync();
						const commentsWithLocation = comments.items.map((comment) => ({
							comment,
							location: comment.getLocation().load({ address: true }),
						}));
						await context.sync();
						const existingComment = commentsWithLocation.find((comment) => comment.location.address === range.address);
						if (existingComment) {
							existingComment.comment.replies.add(input.comment);
						}
						const newComment = existingComment?.comment ?? comments.add(range, input.comment);
						newComment.set({ resolved: input.resolved });
						newComment.load({ expand: "replies" });
						await context.sync();

						chat.addToolOutput({
							tool: toolName,
							toolCallId,
							output: {
								address: range.address,
								isResolved: newComment.resolved,
								thread: [
									{
										author: `${newComment.authorName} <${newComment.authorEmail}>`,
										content: newComment.content,
										createdAt: newComment.creationDate.toISOString(),
									},
									...newComment.replies.items.map((reply) => ({
										author: `${reply.authorName} <${reply.authorEmail}>`,
										content: reply.content,
										createdAt: reply.creationDate.toISOString(),
									})),
								],
							},
						});
					});
					return;
				}

				if (toolName === "editRange") {
					await Excel.run({ delayForCellEdit: true, mergeUndoGroup: true }, async (context) => {
						const range = context.workbook.worksheets.getItem(input.worksheet).getRange(input.address);
						range.set({ values: input.values });
						range.load({ text: true });
						await context.sync();
						chat.addToolOutput({
							tool: toolName,
							toolCallId,
							output: { result: range.text },
						});
					});
					return;
				}

				if (toolName === "readComments") {
					await Excel.run({ delayForCellEdit: true }, async (context) => {
						const comments = input.worksheet
							? context.workbook.worksheets.getItem(input.worksheet).comments.load({ expand: "replies" })
							: context.workbook.comments.load({ expand: "replies" });
						await context.sync();
						const commentsWithLocation = comments.items.map((comment) => ({
							comment,
							location: comment.getLocation().load({ address: true }),
						}));
						await context.sync();

						chat.addToolOutput({
							tool: toolName,
							toolCallId,
							output: {
								count: commentsWithLocation.length,
								items: commentsWithLocation.map((comment) => ({
									address: comment.location.address,
									isResolved: comment.comment.resolved,
									thread: [
										{
											author: `${comment.comment.authorName} <${comment.comment.authorEmail}>`,
											content: comment.comment.content,
											createdAt: comment.comment.creationDate.toISOString(),
										},
										...comment.comment.replies.items.map((reply) => ({
											author: `${reply.authorName} <${reply.authorEmail}>`,
											content: reply.content,
											createdAt: reply.creationDate.toISOString(),
										})),
									],
								})),
							},
						});
					});
					return;
				}

				if (toolName === "editWorksheet") {
					await Excel.run({ delayForCellEdit: true, mergeUndoGroup: true }, async (context) => {
						const worksheet = context.workbook.worksheets.getItem(input.name);
						worksheet.set({
							name: input.rename,
							tabColor: input.color,
							position: input.position,
							showGridlines: input.showGridlines,
							visibility: input.visibility,
						});
						chat.addToolOutput({
							tool: toolName,
							toolCallId,
							output: { success: true },
						});
					});
					return;
				}

				if (toolName === "createWorksheet") {
					await Excel.run({ delayForCellEdit: true, mergeUndoGroup: true }, async (context) => {
						const worksheet = input.copyFrom
							? context.workbook.worksheets.getItem(input.copyFrom).copy()
							: context.workbook.worksheets.add(input.name);
						worksheet.set({
							name: input.name,
							tabColor: input.color,
							position: input.position,
							showGridlines: input.showGridlines,
							visibility: input.visibility,
						});
						chat.addToolOutput({
							tool: toolName,
							toolCallId,
							output: undefined as never,
						});
					});
					return;
				}

				if (toolName === "deleteWorksheet") {
					await Excel.run({ delayForCellEdit: true, mergeUndoGroup: true }, async (context) => {
						context.workbook.worksheets.getItem(input.worksheet).delete();
						chat.addToolOutput({
							tool: toolName,
							toolCallId,
							output: undefined as never,
						});
					});
					return;
				}

				if (toolName === "editWorksheetLayout") {
					await Excel.run({ delayForCellEdit: true, mergeUndoGroup: true }, async (context) => {
						const worksheet = context.workbook.worksheets.getItem(input.worksheet);
						switch (input.operation) {
							case "insertRow":
								worksheet.getRangeByIndexes(input.startIndex, 0, input.count, 0).getEntireRow().insert("Down");
								break;
							case "deleteRow":
								worksheet.getRangeByIndexes(input.startIndex, 0, input.count, 0).getEntireRow().delete("Up");
								break;
							case "insertColumn":
								worksheet.getRangeByIndexes(0, input.startIndex, 0, input.count).getEntireColumn().insert("Right");
								break;
							case "deleteColumn":
								worksheet.getRangeByIndexes(0, input.startIndex, 0, input.count).getEntireColumn().delete("Left");
								break;
							default:
								throw new Error(`Invalid operation: ${input.operation}`);
						}
						chat.addToolOutput({
							tool: toolName,
							toolCallId,
							output: undefined as never,
						});
					});
					return;
				}

				if (toolName === "traceFormulaPrecedents") {
					await Excel.run({ delayForCellEdit: true }, async (context) => {
						const range = context.workbook.worksheets
							.getItem(input.worksheet)
							.getRange(input.address)
							.load({ formulas: true, text: true });

						const precedents = range.getDirectPrecedents().areas.load();
						await context.sync();
						const areas = precedents.items.map((area) => area.areas.load());
						await context.sync();
						const results = areas.flatMap((area) =>
							area.items.map((range) => range.load({ address: true, text: true, formulas: true }))
						);
						await context.sync();

						chat.addToolOutput({
							tool: toolName,
							toolCallId,
							output: {
								targetFormula: range.formulas[0]![0]!,
								targetValue: range.text[0]![0]!,
								count: results.length,
								items: results.map((range) => ({
									address: range.address,
									values: range.text,
									formulas: range.formulas,
								})),
							},
						});
					});
					return;
				}

				if (toolName === "traceFormulaDependents") {
					await Excel.run({ delayForCellEdit: true }, async (context) => {
						const range = context.workbook.worksheets
							.getItem(input.worksheet)
							.getRange(input.address)
							.load({ formulas: true, text: true });
						const dependents = range.getDirectDependents().areas.load();
						await context.sync();
						const areas = dependents.items.map((area) => area.areas.load());
						await context.sync();
						const results = areas.flatMap((area) =>
							area.items.map((range) => range.load({ address: true, text: true, formulas: true }))
						);
						await context.sync();

						chat.addToolOutput({
							tool: toolName,
							toolCallId,
							output: {
								targetFormula: range.formulas[0]![0]!,
								targetValue: range.text[0]![0]!,
								count: results.length,
								items: results.map((range) => ({
									address: range.address,
									values: range.text,
									formulas: range.formulas,
								})),
							},
						});
					});
					return;
				}

				if (toolName === "searchWorkbook") {
					await Excel.run({ delayForCellEdit: true }, async (context) => {
						const worksheets = context.workbook.worksheets.load();
						await context.sync();
						const worksheetsToSearch = input.worksheet
							? [context.workbook.worksheets.getItem(input.worksheet)]
							: worksheets.items;

						const results = worksheetsToSearch.map((worksheet) => worksheet.findAll(input.query, {}).areas.load());
						await context.sync();
						const resultsRange = results.flatMap((range) =>
							range.items.map((range) => range.load({ address: true, formulas: true, text: true }))
						);
						await context.sync();

						const resultsItemData = resultsRange.map((range) => ({
							address: range.address,
							formula: range.formulas[0]![0]!,
							text: range.text[0]![0]!,
						}));

						chat.addToolOutput({
							tool: toolName,
							toolCallId,
							output: {
								count: resultsRange.length,
								items: resultsItemData,
							},
						});
					});
					return;
				}

				if (toolName === "createChart") {
					await Excel.run({ delayForCellEdit: true, mergeUndoGroup: true }, async (context) => {
						const worksheet = context.workbook.worksheets.getItem(input.worksheet);
						const range = worksheet.getRange(input.address);
						const chart = worksheet.charts.add(input.chartType, range);
						chart.set({
							title: input.title,
							legend: input.legend,
						});
						const image = chart.getImage();
						await context.sync();
						const base64String = image.value;

						chat.addToolOutput({
							tool: toolName,
							toolCallId,
							output: { base64String },
						});
					});
					return;
				}

				if (toolName === "getScreenshot") {
					await Excel.run({ delayForCellEdit: true }, async (context) => {
						const worksheet = context.workbook.worksheets.getItem(input.worksheet);
						const range = input.address ? worksheet.getRange(input.address) : worksheet.getUsedRangeOrNullObject(true);
						const data = range.getImage();
						await context.sync();
						if (range.isNullObject === true) {
							chat.addToolOutput({
								tool: toolName,
								toolCallId,
								state: "output-error",
								errorText: "The worksheet is empty",
							});
							return;
						}

						chat.addToolOutput({
							tool: toolName,
							toolCallId,
							output: { base64String: data.value },
						});
					});

					return;
				}
			} catch (error) {
				chat.addToolOutput({
					state: "output-error",
					tool: toolCall.toolName,
					toolCallId: toolCall.toolCallId,
					errorText: error instanceof Error ? error.message : "Unknown error",
				});
			}
		},
	});

	return chat;
};
