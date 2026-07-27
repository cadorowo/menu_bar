'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Inject noindex meta tag dynamically
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'robots');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', 'noindex, nofollow');

    if (pathname === '/admin/login') {
      setIsAuthenticated(true);
      return;
    }

    if (typeof window !== 'undefined') {
      const session = localStorage.getItem('aperitivo_admin_session');
      if (!session) {
        router.push('/admin/login');
      } else {
        setIsAuthenticated(true);
      }
    }
  }, [pathname, router]);

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
        <div className="w-8 h-8 border-3 border-aperitivo-spritz border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row font-sans">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">{children}</main>
    </div>
  );
}
