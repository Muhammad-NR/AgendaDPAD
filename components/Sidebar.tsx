// components/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Calendar, MapPin, LogOut, LucideAlignEndVertical, AlignEndVerticalIcon, LucideAlignEndHorizontal, AlignEndHorizontal, AlignCenter, AlignHorizontalJustifyEndIcon, AlignStartVertical } from 'lucide-react';
import Cookies from 'js-cookie';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('is_admin');
    Cookies.remove('admin_session');
    router.push('/login');
  };

  const menuItems = [
    {
      title: 'Agenda Pimpinan',
      desc: 'Daftar kegiatan, rapat, dan pertemuan pimpinan.',
      href: '/dashboard/pimpinan',
      icon: LucideAlignEndVertical,
    },
    {
      title: 'Agenda Kunjungan',
      desc: 'Kunjungan tamu atau instansi luar ke kantor.',
      href: '/dashboard/kunjungan',
      icon: AlignStartVertical,
    },
  ];

  return (
    <div className="w-80 h-screen bg-[#1a1f37] text-white flex flex-col fixed left-0 top-0 shadow-xl z-10">
      {/* Bagian Logo / Judul */}
      <div className="p-8 pb-4">
        <h1 className="text-2xl font-bold tracking-wide">Agenda DPAD</h1>
        <p className="text-sm text-gray-400 mt-1">Sistem Manajemen Agenda DPAD DIY</p>
      </div>

      {/* Navigasi Utama */}
      <nav className="flex-1 px-4 space-y-4 mt-4">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block p-5 rounded-2xl transition-all duration-300 border ${
                isActive
                  ? 'bg-blue-600 border-blue-500 shadow-lg shadow-blue-900/50 scale-[1.02]'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-white/5'}`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight mb-1">{item.title}</h3>
                  <p className={`text-xs leading-relaxed ${isActive ? 'text-blue-100' : 'text-gray-400'}`}>
                    {item.desc}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bagian Bawah: Penjelasan & Logout */}
      <div className="p-6 mt-auto space-y-4">
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-colors font-medium shadow-lg shadow-red-900/20"
        >
          <LogOut className="w-5 h-5" />
          Keluar    
        </button>
      </div>
    </div>
  );
}