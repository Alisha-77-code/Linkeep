import { useState, useEffect, useCallback, useMemo } from 'react';
import { Site, SiteCategory, SiteInput } from '../types/site';
import * as siteService from '../services/siteService';

interface UseSitesProps {
  isAdmin?: boolean;
}

export function useSites({ isAdmin = false }: UseSitesProps = {}) {
  const [sites, setSites] = useState<Site[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<SiteCategory>('전체');

  // Load sites from service
  const loadSites = useCallback(async (showRefreshingSpinner = false) => {
    if (showRefreshingSpinner) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const data = await siteService.fetchSites();
      setSites(data);
    } catch (err: any) {
      setError(err?.message || '사이트 목록을 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial load & Supabase Realtime subscription
  useEffect(() => {
    loadSites();

    // Subscribe to Google Sheets background sync updates
    const unsubscribe = siteService.subscribeToSitesSync(() => {
      // Refresh sites silently when remote change occurs
      siteService.fetchSites().then((data) => {
        setSites(data);
      }).catch((e) => console.error('Sync fetch error:', e));
    });

    return () => {
      unsubscribe();
    };
  }, [loadSites]);

  // Manual refresh trigger
  const handleRefresh = useCallback(() => {
    return loadSites(true);
  }, [loadSites]);

  // Filtered sites
  const filteredSites = useMemo(() => {
    return sites.filter((site) => {
      // 1. Status filter for students: hide 'hidden' sites
      if (!isAdmin && site.status === 'hidden') {
        return false;
      }

      // 2. Category filter
      if (selectedCategory !== '전체' && site.category !== selectedCategory) {
        return false;
      }

      // 3. Search query filter (site name match, case-insensitive)
      if (search.trim()) {
        const query = search.trim().toLowerCase();
        const matchesName = site.name.toLowerCase().includes(query);
        return matchesName;
      }

      return true;
    });
  }, [sites, isAdmin, selectedCategory, search]);

  // Add site action
  const handleAddSite = async (input: SiteInput): Promise<Site> => {
    const newSite = await siteService.createSite(input);
    setSites((prev) => [newSite, ...prev]);
    return newSite;
  };

  // Update site action
  const handleUpdateSite = async (id: string, input: Partial<SiteInput>): Promise<Site> => {
    const updated = await siteService.updateSite(id, input);
    setSites((prev) => prev.map((s) => (s.id === id ? updated : s)));
    return updated;
  };

  // Delete single site action
  const handleDeleteSite = async (id: string, imageUrl?: string | null): Promise<void> => {
    await siteService.deleteSite(id, imageUrl);
    setSites((prev) => prev.filter((s) => s.id !== id));
  };

  // Bulk delete sites action
  const handleBulkDeleteSites = async (items: { id: string; imageUrl?: string | null }[]): Promise<void> => {
    await siteService.deleteSites(items);
    const ids = items.map((i) => i.id);
    setSites((prev) => prev.filter((s) => !ids.includes(s.id)));
  };

  return {
    sites,
    filteredSites,
    isLoading,
    isRefreshing,
    error,
    search,
    setSearch,
    selectedCategory,
    setSelectedCategory,
    refresh: handleRefresh,
    addSite: handleAddSite,
    updateSite: handleUpdateSite,
    deleteSite: handleDeleteSite,
    bulkDeleteSites: handleBulkDeleteSites,
  };
}
