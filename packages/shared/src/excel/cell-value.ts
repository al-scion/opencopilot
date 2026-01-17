export const authErrorCell: Excel.ErrorCellValue = {
	type: "Error",
	errorType: "Blocked",
	errorSubType: "SignInError",
};

export const inPreviewErrorCell: Excel.ErrorCellValue = {
	type: "Error",
	errorType: "Busy",
	errorSubType: "Unknown", // Use this value when supported: "PlaceholderInFormula"
};

export const notAvailableErrorCell: Excel.ErrorCellValue = {
	type: "Error",
	errorType: "NotAvailable",
};
