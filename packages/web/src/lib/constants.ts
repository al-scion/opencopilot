import { clientEnv } from "../env";

export const APPSOURCE_URL = `https://marketplace.microsoft.com/product/office/${clientEnv.VITE_WEB_EXTENSION_ID}`;
export const EXCEL_URL = `https://pages.store.office.com/addinsinstallpage.aspx?assetid=${clientEnv.VITE_WEB_EXTENSION_ID}`;
// export const EXCEL_WEB_URL = `https://pages.store.office.com/addinsinstallpage.aspx?assetid=${clientEnv.VITE_WEB_EXTENSION_ID}&isWac=True`;
export const EXCEL_DOWNLOAD_REGEX = /href="(ms-excel:https:\/\/[^"]+)"/;
// export const EXCEL_WEB_REGEX = /href="(https:\/\/office\.live\.com\/start\/Excel\.aspx\?[^"]+)"/;
