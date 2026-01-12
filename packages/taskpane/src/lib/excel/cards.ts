const providerData: Excel.CellValueProviderAttributes = {
	description: "Powered by Fabric ↗",
	logoTargetAddress: "https://usefabric.xyz",
	logoSourceAddress: undefined,
};
const hideAll: Excel.CellValuePropertyMetadataExclusions = {
	autoComplete: true,
	dotNotation: true,
	cardView: true,
	calcCompare: true,
};

const cardLayout = ({
	icon,
	title,
	image,
	subTitle,
}: {
	icon?: Excel.EntityCompactLayoutIcons;
	title?: string;
	image?: boolean;
	subTitle?: boolean;
} = {}): Excel.BasicViewLayouts => {
	return {
		compact: { icon },
		card: {
			layout: "Entity",
			title,
			subTitle: { property: subTitle ? "SUBTITLE" : "UPDATEDAT" },
			mainImage: image ? { property: "IMAGE" } : undefined,
		},
	};
};

export const createProperty = (value: string | number): Excel.EntityPropertyType => {
	if (typeof value === "string") {
		return {
			type: Excel.CellValueType.string,
			basicValue: value,
			propertyMetadata: {},
			layouts: {},
			provider: providerData,
		};
	}

	return {
		type: Excel.CellValueType.double,
		basicValue: value,
		propertyMetadata: {},
		provider: providerData,
	};
};

const imageProperty = ({
	imageUrl,
	downloadUrl,
}: {
	imageUrl: string;
	downloadUrl: string;
}): Excel.CellValueAndPropertyMetadata => {
	return {
		type: "WebImage",
		address: imageUrl,
		provider: providerData,
		attribution: [{ licenseText: "Click to download ↓", licenseAddress: downloadUrl }],
	};
};

const updatedAtProperty: Excel.CellValueAndPropertyMetadata = {
	type: "String",
	basicValue: `Last updated: ${new Date().toLocaleString()}`,
	propertyMetadata: { excludeFrom: hideAll },
};

export const getCellValueCard = ({
	basicValue,
	image,
	icon,
}: {
	basicValue: string;
	downloadUrl?: string;
	image?: { imageUrl: string; downloadUrl: string };
	icon?: Excel.EntityCompactLayoutIcons;
}): Excel.CellValue => {
	return {
		type: Excel.CellValueType.string,
		basicValue,
		provider: providerData,
		layouts: cardLayout({ icon, image: !!image }),
		properties: {
			...(image && { IMAGE: imageProperty(image) }),
			UPDATEDAT: updatedAtProperty,
		},
	};
};
