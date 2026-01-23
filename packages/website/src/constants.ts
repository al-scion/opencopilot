import { WEB_EXTENSION_ID } from "astro:env/client";

export const APPSOURCE_URL = `https://marketplace.microsoft.com/en-us/product/office/${WEB_EXTENSION_ID}`;
export const EXCEL_URL = `https://pages.store.office.com/addinsinstallpage.aspx?assetid=${WEB_EXTENSION_ID}`;
export const EXCEL_WEB_URL = `https://pages.store.office.com/addinsinstallpage.aspx?assetid=${WEB_EXTENSION_ID}&isWac=True`;
export const EXCEL_DOWNLOAD_REGEX = /href="(ms-excel:https:\/\/[^"]+)"/;

// Example output of url
// export const OPEN_EXCEL_URL =
// 	"ms-excel:https://api.addins.store.office.com/addinstemplate/en-US/440f883b-9355-4e7f-81ce-19eafd665add/WA200009404/none/Claude-by-Anthropic-in-Excel.xlsx";
// export const OPEN_EXCEL_WEB_URL =
// 	"https://office.live.com/start/Excel.aspx?culture=en-US&omextemplateclient=Excel&omexsessionid=12362d3b-1baf-45a3-8cc9-0e1980c5a478&omexcampaignid=none&templateid=WA200009404&templatetitle=Claude%20by%20Anthropic%20in%20Excel&omexsrctype=1";
// export const SELF_HOSTED_URL = "ms-excel:https://storage.usefabric.xyz/Claude-by-Anthropic-in-Excel.xlsx";
