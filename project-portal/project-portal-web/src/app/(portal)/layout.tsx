'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import PortalNavbar from '@/components/PortalNavbar';
import PortalSidebar from '@/components/PortalSidebar';

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <PortalNavbar />
      <div className="flex min-h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] overflow-hidden">
        <PortalSidebar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-white/30 backdrop-blur-[1px] overflow-y-auto">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
