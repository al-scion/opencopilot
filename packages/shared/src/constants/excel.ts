// Excel enum constants - manually defined to avoid runtime Excel dependency

export const ExcelBorderLineStyle = [
	"None",
	"Continuous",
	"Dash",
	"DashDot",
	"DashDotDot",
	"Dot",
	"Double",
	"SlantDashDot",
] as const;

export const ExcelUnderlineStyle = ["None", "Single", "Double", "SingleAccountant", "DoubleAccountant"] as const;
export const ExcelBorderWeight = ["Hairline", "Thin", "Medium", "Thick"] as const;

export const ExcelBorderIndex = [
	"EdgeTop",
	"EdgeBottom",
	"EdgeLeft",
	"EdgeRight",
	"InsideVertical",
	"InsideHorizontal",
	"DiagonalDown",
	"DiagonalUp",
] as const;

export const ExcelRangeUnderlineStyle = ["None", "Single", "Double", "SingleAccountant", "DoubleAccountant"] as const;

export const ExcelFillPattern = [
	"None",
	"Solid",
	"Gray50",
	"Gray75",
	"Gray25",
	"Horizontal",
	"Vertical",
	"Down",
	"Up",
	"Checker",
	"SemiGray75",
	"LightHorizontal",
	"LightVertical",
	"LightDown",
	"LightUp",
	"Grid",
	"CrissCross",
	"Gray16",
	"Gray8",
	"LinearGradient",
	"RectangularGradient",
] as const;

export const ExcelHorizontalAlignment = [
	"General",
	"Left",
	"Center",
	"Right",
	"Fill",
	"Justify",
	"CenterAcrossSelection",
	"Distributed",
] as const;
