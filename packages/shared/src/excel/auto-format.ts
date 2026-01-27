const FONT_COLORS = {
	input: "#0000FF", //Blue
	formula: "#000000", //Black
	linkedWorksheet: "#008000", //Green
	externalWorkbook: "#FF0000", //Red
	uncategorized: undefined,
} as const;
type FORMULA_CATEGORIES = keyof typeof FONT_COLORS;

// Regex patterns for formula categorization (defined at top level for performance)
// Matches double-quoted string literals, handling escaped quotes ("")
const STRING_LITERAL_PATTERN = /"(?:[^"]|"")*"/g;
// Matches external workbook references: [filename] followed by non-! chars, then !
// Examples: '[Book.xlsx]Sheet'!A1, '[C:\path\Book.xlsx]Sheet'!A1
const EXTERNAL_REF_PATTERN = /\[[^\]]+\][^!]*!/;
// Matches hardcoded literals with = prefix (these are inputs, not formulas)
// Examples: =100, =-50.5, =1.5E10, =100%, =TRUE, =FALSE, ="Hello"
const HARDCODED_LITERAL_PATTERN = /^=\s*(?:-?\d+(?:\.\d+)?(?:e[+-]?\d+)?%?|true|false|"(?:[^"]|"")*")$/i;

/**
 * Categorizes a formula to determine how it should be styled.
 *
 * Categories:
 * - input: Direct values (numbers, booleans, hardcoded literals like =100, ="text")
 * - formula: Regular formulas in the current sheet (e.g., =A1+B1, =SUM(A1:A10))
 * - linkedWorksheet: References to other sheets in the same workbook
 * - externalWorkbook: References to other workbooks
 * - uncategorized: Empty cells or unrecognized patterns
 *
 * Detection approach:
 * 1. Numbers/booleans are inputs
 * 2. Empty strings ("") are uncategorized
 * 3. Hardcoded literals (=100, =TRUE, ="text") are inputs
 * 4. External workbook refs contain [filename] before ! (e.g., '[Book.xlsx]Sheet'!A1)
 * 5. Linked worksheet refs have ! without [filename] (e.g., Sheet1!A1)
 * 6. Everything else is uncategorized (formulas in current sheet)
 *
 * Key insight: Excel sheet names cannot contain [ or ], so [filename.xlsx]
 * pattern reliably indicates an external workbook reference.
 */
const categorizeFormula = (formula: number | boolean | string): FORMULA_CATEGORIES => {
	// Direct numeric/boolean values are user inputs
	if (typeof formula === "number" || typeof formula === "boolean") {
		return "input";
	}

	// Empty strings (empty cells) are uncategorized
	if (formula === "") {
		return "uncategorized";
	}

	// Hardcoded literals with = prefix are inputs (e.g., =100, =TRUE, ="text")
	if (HARDCODED_LITERAL_PATTERN.test(formula)) {
		return "input";
	}

	// Remove double-quoted string literals to avoid false positives
	// e.g., "Hello ""World""" becomes empty, avoiding ! or [ inside text
	const cleaned = formula.replace(STRING_LITERAL_PATTERN, "");

	// Check for external workbook reference
	// External refs have [filename.xlsx] pattern before the !
	if (EXTERNAL_REF_PATTERN.test(cleaned)) {
		return "externalWorkbook";
	}

	// Check for linked worksheet (same workbook, different sheet)
	// These have ! but without the [filename] pattern
	// Examples: Sheet1!A1, 'Sheet Name'!A1, Sheet1:Sheet3!A1, O'Brien'!A1
	if (cleaned.includes("!")) {
		return "linkedWorksheet";
	}

	// Regular formula in the current sheet
	return "uncategorized";
};

// Apply font colors to formulas based on their category
export const autoFormat = async (event: Excel.WorksheetChangedEventArgs) => {
	const isValid = event.triggerSource === "ThisLocalAddin" && event.source === "Local";
	if (!isValid) {
		return;
	}
	// event.
	await Excel.run({ delayForCellEdit: true, mergeUndoGroup: true }, async (context) => {
		// const range = context.workbook.worksheets.getItem(event.worksheetId).getRange(event.address);
		const range = event.getRangeOrNullObject(context).load({ formulas: true, numberFormatCategories: true });
		await context.sync();
		if (range.isNullObject) {
			return;
		}

		range.formulas.forEach((row, rowIndex) => {
			row.forEach((formula, columnIndex) => {
				// const numberFormatCategory = range.numberFormatCategories[rowIndex]![columnIndex]!;
				const category = categorizeFormula(formula);
				const fontColor = FONT_COLORS[category];
				range.getCell(rowIndex, columnIndex).set({ format: { font: { color: fontColor } } });
			});
		});
	});
};

// This is currently in development
// We are testing the performanc for using js functions only.
const processChanges = async (event: Excel.WorksheetChangedEventArgs) => {
	await Excel.run({ delayForCellEdit: true, mergeUndoGroup: true }, async (context) => {
		const range = event.getRangeOrNullObject(context).load({ formulas: true, numberFormatCategories: true });
		await context.sync();
		if (range.isNullObject) {
			return;
		}
		range
			.getSpecialCellsOrNullObject(Excel.SpecialCellType.constants, "LogicalNumbers")
			.set({ format: { font: { color: FONT_COLORS.input } } });
		range
			.getSpecialCellsOrNullObject(Excel.SpecialCellType.formulas, "NumbersText")
			.set({ format: { font: { color: FONT_COLORS.input } } });

		range.getSpecialCellsOrNullObject(Excel.SpecialCellType.formulas, "Errors");
		// range.dependents
	});
};
