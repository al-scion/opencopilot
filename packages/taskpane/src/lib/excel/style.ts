import { z } from "zod";
import {
	ExcelBorderIndex,
	ExcelBorderLineStyle,
	ExcelBorderWeight,
	ExcelHorizontalAlignment,
	ExcelUnderlineStyle,
} from "@/lib/constants";

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

export const BORDER_FORMATS = {
	none: null,
	bottom: ["EdgeBottom"],
	top: ["EdgeTop"],
	left: ["EdgeLeft"],
	right: ["EdgeRight"],
	outside: ["EdgeTop", "EdgeBottom", "EdgeLeft", "EdgeRight"],
	topBottom: ["EdgeTop", "EdgeBottom"],
	all: "All",
} satisfies Record<string, (typeof ExcelBorderIndex)[number][] | null | "All">;
export type BorderFormatEnum = keyof typeof BORDER_FORMATS;
export const borderFormatEnumSchema = z.enum(Object.keys(BORDER_FORMATS) as [BorderFormatEnum]);
export const applyBorderFormat = (range: Excel.Range, format: BorderFormatEnum) => {
	const borderFormat = BORDER_FORMATS[format];
	if (borderFormat === null) {
		ExcelBorderIndex.forEach((value) => {
			range.format.borders.getItem(value).set({ style: "None" });
		});
	}
};

const fontSchema = z.object({
	bold: z.boolean().optional(),
	italic: z.boolean().optional(),
	color: z.string().optional(),
	name: z.string().optional(),
	size: z.number().optional(),
	strikeThrough: z.boolean().optional(),
	subscript: z.boolean().optional(),
	superscript: z.boolean().optional(),
	underline: z.enum(ExcelUnderlineStyle).optional(),
});
const fillSchema = z.object({
	color: z.string().optional(),
});
const borderSchema = z.object({
	color: z.string().optional(),
	style: z.enum(ExcelBorderLineStyle).optional(),
	weight: z.enum(ExcelBorderWeight).optional(),
	sideIndex: z.enum(ExcelBorderIndex),
});

const styleSchema = z.object({
	font: fontSchema.optional(),
	fill: fillSchema.optional(),
	borders: borderSchema.array().optional(),
	horizontalAlignment: z.enum(ExcelHorizontalAlignment).optional(),
});
type Style = z.infer<typeof styleSchema>;

export const STYLES = [
	{
		id: "h1",
		description: "Bold light font on dark background",
		style: {
			font: {
				bold: true,
				color: "#002060", // Dark Blue
			},
			fill: {
				color: "#000000", // Black
			},
		},
	},
	{
		id: "h2",
		description: "Light font on light gray background",
		style: {
			fill: {
				color: "#D9D9D9", // Gray
			},
		},
	},
];

export const styleIdSchema = z.enum(STYLES.map(({ id }) => id));
