import { z } from "zod";

export const NUMBER_FORMATS = {
	number: `_(* #,##0_);_(* (#,##0);_(* "-"_);_(@_)`,
	currency: `_($* #,##0.00_);_($* (#,##0.00);_($* "-"_);_(@_)`,
	multiple: `_(* #,##0.0"x"_);_(* (#,##0.0"x");_(* "N.M."_);_(@_)`,
	percentage: `0.0%_);(0.0%);_(* "N.M."_);_(@_)`,
	date: "DD-MMM-YYYY",
	text: undefined,
} as const;
export type NumberFormatEnum = keyof typeof NUMBER_FORMATS;
export const numberFormatEnumSchema = z.enum(Object.keys(NUMBER_FORMATS) as [NumberFormatEnum]);
export const getNumberFormatString = (format: NumberFormatEnum) => NUMBER_FORMATS[format];
