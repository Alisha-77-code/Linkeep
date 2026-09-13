import { Site, SiteInput } from '../types/site';
import { isGoogleSheetConfigured, getGoogleSheetApiUrl } from '../lib/googleSheet';
import { INITIAL_DEFAULT_SITES } from '../constants/defaultSites';

const FALLBACK_STORAGE_KEY = 'linkeep_sites_fallback_db';
const INITIALIZED_FLAG_KEY = 'linkeep_sites_initialized_v1';

// Local storage fallback helpers
function getLocalFallbackSites(): Site[] {
  try {
    const isInitialized = localStorage.getItem(INITIALIZED_FLAG_KEY);
    const raw = localStorage.getItem(FALLBACK_STORAGE_KEY);

    // Only on very first launch on this device, seed the initial sites
    if (!isInitialized) {
      localStorage.setItem(INITIALIZED_FLAG_KEY, 'true');
      localStorage.setItem(FALLBACK_STORAGE_KEY, JSON.stringify(INITIAL_DEFAULT_SITES));
      return INITIAL_DEFAULT_SITES;
    }

    if (!raw) {
      return [];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveLocalFallbackSites(sites: Site[]): void {
  try {
    localStorage.setItem(INITIALIZED_FLAG_KEY, 'true');
    localStorage.setItem(FALLBACK_STORAGE_KEY, JSON.stringify(sites));
  } catch (err) {
    console.error('Failed to save to local fallback storage:', err);
  }
}

/**
 * Fetch all sites from Google Sheets (or fallback).
 * Always returns sites sorted by created_at descending (newest first).
 */
export async function fetchSites(): Promise<Site[]> {
  if (!isGoogleSheetConfigured()) {
    return getLocalFallbackSites().sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  try {
    const apiUrl = getGoogleSheetApiUrl();
    const res = await fetch(apiUrl, { method: 'GET' });

    if (!res.ok) {
      throw new Error(`구글 시트 응답 오류 (${res.status})`);
    }

    const result = await res.json();
    if (!result.success || !Array.isArray(result.data)) {
      throw new Error(result.error || '데이터 형식이 올바르지 않습니다.');
    }

    const rawSites = result.data as any[];
    const sites: Site[] = rawSites.map((s) => {
      const rawUrl = s.url || s.URL || s.Url || s['사이트 주소'] || s['링크'] || '';
      const st = String(s.status || 'public').trim().toLowerCase();
      let status: Site['status'] = 'public';
      if (st === 'locked' || st === '잠금') status = 'locked';
      else if (st === 'hidden' || st === '숨김') status = 'hidden';

      return {
        id: String(s.id || '').trim(),
        name: String(s.name || '수업 사이트').trim(),
        url: rawUrl ? (rawUrl.startsWith('http') ? rawUrl.trim() : `https://${rawUrl.trim()}`) : '',
        category: s.category || '기타',
        image_url: s.image_url || null,
        image_type: s.image_type || 'emoji',
        emoji: s.emoji || '🌐',
        status,
        memo: s.memo || '',
        sort_order: Number(s.sort_order) || 0,
        created_at: s.created_at || new Date().toISOString(),
        updated_at: s.updated_at || new Date().toISOString(),
      };
    });

    // Keep local fallback storage synchronized with Google Sheets
    saveLocalFallbackSites(sites);

    return sites.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  } catch (err: any) {
    console.warn('Google Sheet fetch failed, using fallback:', err);
    return getLocalFallbackSites().sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }
}

/**
 * Create a new site in Google Sheets
 */
export async function createSite(siteInput: SiteInput): Promise<Site> {
  const now = new Date().toISOString();
  const newSiteId = `site_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const newSite: Site = {
    ...siteInput,
    id: newSiteId,
    created_at: now,
    updated_at: now,
    sort_order: siteInput.sort_order ?? 0,
  };

  // Update local cache immediately
  const current = getLocalFallbackSites();
  saveLocalFallbackSites([newSite, ...current]);

  if (!isGoogleSheetConfigured()) {
    return newSite;
  }

  try {
    const apiUrl = getGoogleSheetApiUrl();
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        action: 'create',
        data: newSite,
      }),
    });

    if (!res.ok) {
      throw new Error(`구글 시트 저장 통신 오류 (${res.status})`);
    }

    const result = await res.json();
    if (!result.success) {
      throw new Error(result.error || '구글 시트에 사이트 저장 실패');
    }

    return newSite;
  } catch (err: any) {
    console.error('Google Sheet create error:', err);
    throw err;
  }
}

/**
 * Update an existing site in Google Sheets
 */
export async function updateSite(id: string, siteInput: Partial<SiteInput>): Promise<Site> {
  const now = new Date().toISOString();

  // Update local cache immediately
  const current = getLocalFallbackSites();
  const index = current.findIndex((s) => s.id === id);
  const updatedSite: Site =
    index !== -1
      ? { ...current[index], ...siteInput, updated_at: now }
      : ({ ...siteInput, id, created_at: now, updated_at: now } as Site);

  if (index !== -1) {
    current[index] = updatedSite;
    saveLocalFallbackSites(current);
  }

  if (!isGoogleSheetConfigured()) {
    return updatedSite;
  }

  try {
    const apiUrl = getGoogleSheetApiUrl();
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        action: 'update',
        id,
        data: siteInput,
      }),
    });

    if (!res.ok) {
      throw new Error(`구글 시트 수정 통신 오류 (${res.status})`);
    }

    const result = await res.json();
    if (!result.success) {
      throw new Error(result.error || '구글 시트 수정 실패');
    }

    return updatedSite;
  } catch (err: any) {
    console.error('Google Sheet update error:', err);
    throw err;
  }
}

/**
 * Delete a single site in Google Sheets
 */
export async function deleteSite(id: string, _imageUrl?: string | null): Promise<void> {
  // Update local cache immediately
  const current = getLocalFallbackSites();
  saveLocalFallbackSites(current.filter((s) => s.id !== id));

  if (!isGoogleSheetConfigured()) {
    return;
  }

  try {
    const apiUrl = getGoogleSheetApiUrl();
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        action: 'delete',
        id,
      }),
    });

    if (!res.ok) {
      throw new Error(`구글 시트 삭제 통신 오류 (${res.status})`);
    }

    const result = await res.json();
    if (!result.success) {
      throw new Error(result.error || '구글 시트 삭제 실패');
    }
  } catch (err: any) {
    console.error('Google Sheet delete error:', err);
    throw err;
  }
}

/**
 * Bulk delete sites in Google Sheets
 */
export async function deleteSites(sites: { id: string; imageUrl?: string | null }[]): Promise<void> {
  const ids = sites.map((s) => String(s.id).trim());

  // Update local cache immediately
  const current = getLocalFallbackSites();
  const filtered = current.filter((s) => !ids.includes(String(s.id).trim()));
  saveLocalFallbackSites(filtered);

  if (!isGoogleSheetConfigured()) {
    return;
  }

  try {
    const apiUrl = getGoogleSheetApiUrl();
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        action: 'bulk_delete',
        ids,
      }),
    });

    if (!res.ok) {
      throw new Error(`구글 시트 일괄 삭제 통신 오류 (${res.status})`);
    }

    const result = await res.json();
    if (!result.success) {
      throw new Error(result.error || '구글 시트 일괄 삭제 실패');
    }
  } catch (err: any) {
    console.error('Google Sheet bulk delete error:', err);
    throw err;
  }
}

/**
 * Polls Google Sheets for changes every intervalMs (default 20 seconds)
 * and triggers onChange callback when updated.
 */
export function subscribeToSitesSync(onChange: () => void, intervalMs = 20000): () => void {
  // Listen for local tab changes
  const storageHandler = (e: StorageEvent) => {
    if (e.key === FALLBACK_STORAGE_KEY) {
      onChange();
    }
  };
  window.addEventListener('storage', storageHandler);

  // Background polling for Google Sheets
  const timer = setInterval(() => {
    if (isGoogleSheetConfigured()) {
      onChange();
    }
  }, intervalMs);

  return () => {
    window.removeEventListener('storage', storageHandler);
    clearInterval(timer);
  };
}
