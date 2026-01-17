/**
 * Converts a 2D JSON array into a compact Markdown table string.
 * This format is optimized for LLM token usage while adhering to standard GFM table syntax.
 * It strictly removes alignment padding to save tokens.
 *
 * @param data - The 2D array of data (e.g., from Excel).
 * @returns A string representing the Markdown table.
 */
export function jsonToMarkdownTable(data: unknown[][]): string {
	if (!data || data.length === 0) {
		return "";
	}
	// Helper to escape pipes and remove newlines to preserve table structure
	const escapeValue = (value: unknown): string => {
		if (value === null || value === undefined) {
			return "";
		}
		// Convert to string, escape pipes with backslash, and replace newlines with spaces
		return String(value).replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
	};
	const lines: string[] = [];
	for (const currentRow of data) {
		const processed = currentRow.map(escapeValue);
		const line = `|${processed.join("|")}|`;
		lines.push(line);
	}
	return lines.join("\n");
}
