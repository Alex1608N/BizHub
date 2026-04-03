'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { COMPANY_COOKIE_NAME } from '@/lib/company';

interface CompanyContextType {
  selectedCompanyId: number | null;
  setSelectedCompanyId: (id: number | null) => void;
  clearSelectedCompany: () => void;
}

const CompanyContext = createContext<CompanyContextType>({
  selectedCompanyId: null,
  setSelectedCompanyId: () => {},
  clearSelectedCompany: () => {},
});

export function useCompany() {
  return useContext(CompanyContext);
}

export function CompanyProvider({ 
  children, 
  initialCompanyId 
}: { 
  children: React.ReactNode;
  initialCompanyId: number | null;
}) {
  const [selectedCompanyId, setSelectedCompanyIdState] = useState<number | null>(initialCompanyId);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setSelectedCompanyIdState(initialCompanyId);
  }, [initialCompanyId]);

  const setSelectedCompanyId = (id: number | null) => {
    setSelectedCompanyIdState(id);
    
    if (id) {
      document.cookie = `${COMPANY_COOKIE_NAME}=${id}; path=/; max-age=31536000; SameSite=Lax`;
    }
    
    if (pathname !== '/dashboard' && pathname !== '/firme') {
      const separator = pathname.includes('?') ? '&' : '?';
      router.push(`${pathname}${separator}companyId=${id}`);
    }
  };

  const clearSelectedCompany = () => {
    setSelectedCompanyIdState(null);
    document.cookie = `${COMPANY_COOKIE_NAME}=; path=/; max-age=0`;
    router.push('/dashboard');
  };

  return (
    <CompanyContext.Provider value={{ selectedCompanyId, setSelectedCompanyId, clearSelectedCompany }}>
      {children}
    </CompanyContext.Provider>
  );
}
