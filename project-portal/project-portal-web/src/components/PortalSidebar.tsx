'use client';

import { Home, FolderKanban, BarChart3, Satellite, CreditCard, Users, FileText, Settings, LogOut, ChevronLeft, FileBarChart } from 'lucide-react';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store/store';
import Link from 'next/link';

const PortalSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const logout = useStore((s) => s.logout);

  const navItems = [
    { icon: Home, label: 'Dashboard', href: '/', active: pathname === '/' },
    { icon: FolderKanban, label: 'Projects', href: '/projects', active: pathname.includes('/projects') },
    { icon: BarChart3, label: 'Analytics', href: '/analytics', active: pathname.includes('/analytics') },
    { icon: FileBarChart, label: 'Reports', href: '/reports', active: pathname.includes('/reports') },
    { icon: Satellite, label: 'Monitoring', href: '/monitoring', active: pathname.includes('/monitoring') },
    { icon: CreditCard, label: 'Financing', href: '/financing', active: pathname.includes('/financing') },
    { icon: Users, label: 'Team', href: '/team', active: pathname.includes('/team') },
    { icon: FileText, label: 'Documents', href: '/documents', active: pathname.includes('/documents') },
    { icon: Settings, label: 'Settings', href: '/settings', active: pathname.includes('/settings') },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col bg-white/95 border-r border-gray-200 transition-all duration-300 h-full max-h-full overflow-hidden ${collapsed ? 'w-16' : 'w-56'}`}>
        {/* Toggle Button */}
        <div className="p-3 border-b border-gray-200">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center"
          >
            <ChevronLeft className={`w-5 h-5 text-gray-600 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center p-2.5 rounded-xl transition-all duration-200 ${
                  item.active
                    ? 'bg-linear-to-r from-emerald-50 to-teal-50 text-emerald-700 border border-emerald-200'
                    : 'text-gray-700 hover:bg-gray-100 hover:scale-102'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span className="ml-2.5 font-medium text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-3 border-t border-gray-200">
          <button
            type="button"
            onClick={async () => {
              await logout();
              router.replace('/login');
            }}
            className="flex items-center p-2.5 text-gray-700 hover:bg-gray-100 rounded-xl w-full transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span className="ml-2.5 font-medium text-sm">Log Out</span>}
          </button>
          
          {/* Project Status */}
          {!collapsed && (
            <div className="mt-3 p-2.5 bg-linear-to-r from-emerald-50 to-teal-50 rounded-xl">
              <div className="text-sm font-medium text-emerald-800">Active Projects</div>
              <div className="text-xl font-bold text-emerald-900 mt-1">6</div>
              <div className="text-xs text-emerald-600">All systems operational</div>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="grid grid-cols-6 gap-1 px-2 py-2">
          {[navItems[0], navItems[1], navItems[2], navItems[3], navItems[8]].map((item) => {
            if (!item) return null;
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex flex-col items-center p-1.5 rounded-xl transition-colors ${
                  item.active ? 'text-emerald-600 bg-emerald-50' : 'text-gray-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-[10px] font-medium mt-1 leading-tight text-center">{item.label}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={async () => {
              await logout();
              router.replace('/login');
            }}
            className="flex flex-col items-center p-1.5 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-[10px] font-medium mt-1 leading-tight">Logout</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default PortalSidebar;
