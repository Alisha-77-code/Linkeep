/**
 * Normalizes a URL string by ensuring it starts with https:// or http://.
 * Safely handles null, undefined, numbers, or strings with whitespace.
 */
export function normalizeUrl(url: unknown): string {
  if (!url) return '';
  const str = String(url).trim();
  if (!str) return '';
  if (/^https?:\/\//i.test(str)) {
    return str;
  }
  return `https://${str}`;
}

/**
 * Validates whether the given string is a plausible URL.
 */
export function isValidUrl(url: unknown): boolean {
  if (!url) return false;
  const normalized = normalizeUrl(url);
  if (!normalized) return false;
  try {
    const parsed = new URL(normalized);
    return Boolean(parsed.protocol === 'http:' || parsed.protocol === 'https:');
  } catch {
    return /^https?:\/\/.+/i.test(normalized);
  }
}

/**
 * Safely opens an external URL in a new window/tab.
 * Uses a native anchor element dispatch to prevent browser popup blockers.
 */
export function safeOpenUrl(url: unknown): void {
  const targetUrl = normalizeUrl(url);
  if (!targetUrl || !isValidUrl(targetUrl)) {
    alert('올바른 웹사이트 주소가 아닙니다.');
    return;
  }
  
  const anchor = document.createElement('a');
  anchor.href = targetUrl;
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}
