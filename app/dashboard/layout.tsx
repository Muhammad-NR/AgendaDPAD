// app/dashboard/layout.tsx
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar />
      {/* Perhatikan ml-80 di bawah ini (sebelumnya ml-64) */}
      <main className="flex-1 ml-80 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}