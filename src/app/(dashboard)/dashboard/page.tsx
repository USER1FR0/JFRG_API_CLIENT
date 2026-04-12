'use client';

import { useAuth } from '@/core/hooks/useAuth';
import Link from 'next/link';
import { CheckSquare, User, ArrowRight } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  const cards = [
    {
      href: '/tasks',
      icon: CheckSquare,
      title: 'Tareas',
      desc: 'Organiza y completa tus pendientes',
    },
    {
      href: '/profile',
      icon: User,
      title: 'Mi perfil',
      desc: 'Actualiza tu información personal',
    },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
          Hola, {user?.name} 👋
        </h1>
        <p className="text-sm text-gray-400 mt-1">¿Qué haremos hoy?</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {cards.map(({ href, icon: Icon, title, desc }) => (
          <Link
            key={href}
            href={href}
            className="group bg-white border border-gray-100 rounded-2xl p-5
              hover:border-gray-200 hover:shadow-sm transition-all"
          >
            <div className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center mb-4
              group-hover:bg-black group-hover:text-white transition-all">
              <Icon size={16} className="text-gray-500 group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
            <div className="mt-4 flex items-center gap-1 text-xs text-gray-400 group-hover:text-gray-700 transition-colors">
              Ir <ArrowRight size={12} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
