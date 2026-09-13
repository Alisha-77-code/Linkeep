// Google Apps Script Web App Configuration
const googleSheetApiUrl = import.meta.env.VITE_GOOGLE_SHEET_API_URL || '';

export const isGoogleSheetConfigured = (): boolean => {
  return Boolean(
    googleSheetApiUrl &&
    googleSheetApiUrl.startsWith('https://script.google.com/macros/s/') &&
    !googleSheetApiUrl.includes('your-google-script-id')
  );
};

export const getGoogleSheetApiUrl = (): string => googleSheetApiUrl;
