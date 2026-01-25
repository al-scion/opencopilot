import {
	clearRangeDef,
	copyPasteDef,
	createWorksheetDef,
	deleteWorksheetDef,
	editRangeDef,
	editWorksheetDef,
	editWorksheetLayoutDef,
	jsonToMarkdownTable,
	readCommentsDef,
	readWorksheetDef,
	searchWorkbookDef,
	traceFormulaDependentsDef,
	traceFormulaPrecedentsDef,
	writeCommentDef,
} from "@packages/shared";

const copyPasteClient = copyPasteDef.client(async (input) => {
	const result = await Excel.run({ delayForCellEdit: true, mergeUndoGroup: true }, async (context) => {
		const source = context.workbook.worksheets.getItem(input.source.worksheet).getRange(input.source.address);
		const target = context.workbook.worksheets.getItem(input.destination.worksheet).getRange(input.destination.address);
		target.copyFrom(source);
		target.load({ address: true, text: true });
		await context.sync();
		return {
			address: target.address,
			values: jsonToMarkdownTable(target.text),
		};
	});
	return result;
});

const readWorksheetClient = readWorksheetDef.client(async (input) => {
	const result = await Excel.run({ delayForCellEdit: true }, async (context) => {
		const worksheet = context.workbook.worksheets.getItem(input.worksheet);
		const range = input.address ? worksheet.getRange(input.address) : worksheet.getUsedRange(true);
		range.load({ text: true, formulas: true });
		await context.sync();

		return {
			formulas: jsonToMarkdownTable(range.formulas),
			text: jsonToMarkdownTable(range.text),
		};
	});
	return result;
});

const editRangeClient = editRangeDef.client(async (input) => {
	const result = await Excel.run({ delayForCellEdit: true, mergeUndoGroup: true }, async (context) => {
		const range = context.workbook.worksheets.getItem(input.worksheet).getRange(input.address);
		range.set({ values: input.values });
		range.load({ text: true });
		await context.sync();
		return jsonToMarkdownTable(range.text);
	});
	return { result };
});

const clearRangeClient = clearRangeDef.client(async (input) => {
	await Excel.run({ delayForCellEdit: true, mergeUndoGroup: true }, async (context) => {
		context.workbook.worksheets.getItem(input.worksheet).getRange(input.address).clear("All");
	});
	return { success: true };
});

const writeCommentClient = writeCommentDef.client(async (input) => {
	const result = await Excel.run({ delayForCellEdit: true, mergeUndoGroup: true }, async (context) => {
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

		return {
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
		};
	});
	return result;
});

const readCommentsClient = readCommentsDef.client(async (input) => {
	const result = await Excel.run({ delayForCellEdit: true }, async (context) => {
		const comments = input.worksheet
			? context.workbook.worksheets.getItem(input.worksheet).comments.load({ expand: "replies" })
			: context.workbook.comments.load({ expand: "replies" });
		await context.sync();
		const commentsWithLocation = comments.items.map((comment) => ({
			comment,
			location: comment.getLocation().load({ address: true }),
		}));
		await context.sync();

		return {
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
		};
	});

	return result;
});

const editWorksheetClient = editWorksheetDef.client(async (input) => {
	await Excel.run({ delayForCellEdit: true, mergeUndoGroup: true }, async (context) => {
		const worksheet = context.workbook.worksheets.getItem(input.name);
		worksheet.set({
			name: input.rename,
			tabColor: input.color,
			position: input.position,
			showGridlines: input.showGridlines,
			visibility: input.visibility,
		});
	});
	return { success: true };
});

const createWorksheetClient = createWorksheetDef.client(async (input) => {
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
	});
});

const deleteWorksheetClient = deleteWorksheetDef.client(async (input) => {
	await Excel.run({ delayForCellEdit: true, mergeUndoGroup: true }, async (context) => {
		context.workbook.worksheets.getItem(input.worksheet).delete();
	});
	return { success: true };
});

const editWorksheetLayoutClient = editWorksheetLayoutDef.client(async (input) => {
	const result = await Excel.run({ delayForCellEdit: true, mergeUndoGroup: true }, async (context) => {
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
	});
	return result;
});

const traceFormulaPrecedentsClient = traceFormulaPrecedentsDef.client(async (input) => {
	const result = await Excel.run({ delayForCellEdit: true }, async (context) => {
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

		return {
			targetFormula: range.formulas[0]![0]!,
			targetValue: range.text[0]![0]!,
			count: results.length,
			items: results.map((range) => ({
				address: range.address,
				values: range.text,
				formulas: range.formulas,
			})),
		};
	});

	return result;
});

const traceFormulaDependentsClient = traceFormulaDependentsDef.client(async (input) => {
	const result = await Excel.run({ delayForCellEdit: true }, async (context) => {
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

		return {
			targetFormula: range.formulas[0]![0]!,
			targetValue: range.text[0]![0]!,
			count: results.length,
			items: results.map((range) => ({
				address: range.address,
				values: range.text,
				formulas: range.formulas,
			})),
		};
	});
	return result;
});

const searchWorkbookClient = searchWorkbookDef.client(async (input) => {
	const result = await Excel.run({ delayForCellEdit: true }, async (context) => {
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

		return {
			count: resultsRange.length,
			items: resultsItemData,
		};
	});

	return result;
});

export {
	clearRangeClient,
	editRangeClient,
	editWorksheetClient,
	searchWorkbookClient,
	readWorksheetClient,
	traceFormulaPrecedentsClient,
	traceFormulaDependentsClient,
	writeCommentClient,
	readCommentsClient,
	copyPasteClient,
	editWorksheetLayoutClient,
	createWorksheetClient,
	deleteWorksheetClient,
};
