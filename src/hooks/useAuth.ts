import { useState, useEffect, useCallback } from 'react';

const ADMIN_PIN_KEY = 'linkeep_admin_auth_session';
const DEFAULT_PIN = '6165';

export function useAuth() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem(ADMIN_PIN_KEY) === 'true';
  });

  const [isPinModalOpen, setIsPinModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleStorage = () => {
      setIsAdminAuthenticated(sessionStorage.getItem(ADMIN_PIN_KEY) === 'true');
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const loginWithPin = useCallback((pin: string): boolean => {
    if (pin.trim() === DEFAULT_PIN) {
      sessionStorage.setItem(ADMIN_PIN_KEY, 'true');
      setIsAdminAuthenticated(true);
      setIsPinModalOpen(false);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(ADMIN_PIN_KEY);
    setIsAdminAuthenticated(false);
  }, []);

  const openPinModal = useCallback(() => {
    setIsPinModalOpen(true);
  }, []);

  const closePinModal = useCallback(() => {
    setIsPinModalOpen(false);
  }, []);

  return {
    isAdminAuthenticated,
    isPinModalOpen,
    openPinModal,
    closePinModal,
    loginWithPin,
    logout,
  };
}
