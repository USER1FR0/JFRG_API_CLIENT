'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { CheckSquare, User, LogOut, LayoutDashboard } from 'lucide-react';
import { AuthGuard } from '@/core/guards/AuthGuard';
import { useAuth } from '@/core/hooks/useAuth';
import { useAxiosAuth } from '@/core/hooks/useAxiosAuth';
import { authService } from '@/modules/auth/services/auth.service';
import { serializeError } from '@/core/utils/error.util';

const NAV = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Inicio' },
  { href: '/tasks', icon: CheckSquare, label: 'Tareas' },
  { href: '/profile', icon: User, label: 'Perfil' },
];

function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { clearSession, user } = useAuth();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('[logout]', serializeError(err).message);
    } finally {
      clearSession();
      router.replace('/login');
    }
  };

  return (
    <aside className="w-56 shrink-0 border-r border-gray-100 bg-white flex flex-col h-screen sticky top-0">
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-black rounded-lg flex items-center justify-center">
            <CheckSquare size={14} className="text-white" />
          </div>
          <span className="text-sm font-semibold text-gray-900">JFRG</span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all
                ${active
                  ? 'bg-black text-white font-medium'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-gray-100">
        <div className="px-3 py-2 mb-1">
          <p className="text-xs font-medium text-gray-700 truncate">
            {user?.name} {user?.lastName}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm
            text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

function DashboardInner({ children }: { children: React.ReactNode }) {
  useAxiosAuth();
  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <DashboardInner>{children}</DashboardInner>
    </AuthGuard>
  );
}