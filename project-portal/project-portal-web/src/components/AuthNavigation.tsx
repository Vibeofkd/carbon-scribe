'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store/store';

export default function AuthNavigation() {
  const pathname = usePathname();
  const router = useRouter();

  const isHydrated = useStore((s) => s.isHydrated);
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  const logout = useStore((s) => s.logout);

  if (!isHydrated) {
    return <div className="h-9" />;
  }

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/"
          className="px-3 py-2 rounded-lg border border-emerald-200 text-emerald-700 bg-white/90 hover:bg-emerald-50 transition shadow-sm"
        >
          Dashboard
        </Link>
        <button
          type="button"
          onClick={async () => {
            await logout();
            router.replace('/login');
          }}
          className="px-3 py-2 rounded-lg border border-teal-200 bg-teal-50 text-teal-800 hover:bg-teal-100 transition shadow-sm"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className={`px-3 py-2 rounded-lg border transition ${
          pathname === '/login'
            ? 'border-emerald-600 bg-emerald-600 text-white'
            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
      >
        Login
      </Link>
      <Link
        href="/register"
        className={`px-3 py-2 rounded-lg border transition ${
          pathname === '/register'
            ? 'border-emerald-600 bg-emerald-600 text-white'
            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
      >
        Register
      </Link>
    </div>
  );
}
