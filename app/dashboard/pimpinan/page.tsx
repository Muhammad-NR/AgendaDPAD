'use client';

import { useState, useEffect } from 'react';
import { Plus, ChevronLeft, ChevronRight, MapPin, Clock, X, Loader2, Pencil, Trash2, AlertTriangle, Calendar as CalIcon, AlignLeft, MoreVertical } from 'lucide-react';
import Cookies from 'js-cookie';

export default function AgendaPimpinanPage() {
  const isAdmin = Cookies.get('is_admin') === 'true';
  
  // --- STATE ---
  const [currentDate, setCurrentDate] = useState(new Date());
  const [agendas, setAgendas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State Modal Tambah/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // State Modal Hapus
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // State Form
  const [formData, setFormData] = useState({
    title: '', description: '', time: '', end_time: '', location: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // State untuk dropdown menu di kartu agenda
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // --- FETCH DATA ---
  useEffect(() => {
    fetchAgendas();
  }, []);

  const fetchAgendas = async () => {
    const res = await fetch('/api/pimpinan');
    const data = await res.json();
    if (Array.isArray(data)) setAgendas(data);
    setLoading(false);
  };

  // --- LOGIC HAPUS ---
  const openDeleteModal = (id: string) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
    setOpenMenuId(null); // Tutup menu saat modal hapus dibuka
  };

  const executeDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/pimpinan/${deleteId}`, { method: 'DELETE' });
      if (res.ok) {
        fetchAgendas();
        setIsDeleteModalOpen(false);
        setDeleteId(null);
      }
    } catch (error) { 
      console.error(error); 
    }
  };

  // --- LOGIC FORM ---
  const handleEdit = (agenda: any) => {
    setEditingId(agenda.id);
    setFormData({
      title: agenda.title,
      description: agenda.description || '',
      time: agenda.time,
      end_time: agenda.end_time || '',
      location: agenda.location || ''
    });
    setSelectedDate(agenda.date);
    setIsModalOpen(true);
    setOpenMenuId(null); // Tutup menu saat modal edit dibuka
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ title: '', description: '', time: '', end_time: '', location: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const dateToSubmit = selectedDate || new Date().toISOString().split('T')[0];
    const url = editingId ? `/api/pimpinan/${editingId}` : '/api/pimpinan';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, date: dateToSubmit }),
      });

      if (res.ok) {
        closeModal();
        fetchAgendas();
      } else {
        alert('Gagal menyimpan data');
      }
    } catch (error) { console.error(error); } finally { setIsSubmitting(false); }
  };

  // --- LOGIC KALENDER ---
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };
  const days = getDaysInMonth(currentDate);
  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  
  const filteredAgendas = selectedDate 
    ? agendas.filter(a => a.date === selectedDate)
    : agendas.filter(a => new Date(a.date).toDateString() === new Date().toDateString());

  const displayDate = selectedDate 
    ? new Date(selectedDate).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const toggleMenu = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  // Tutup menu saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId && !(event.target as Element).closest('.agenda-menu-button') && !(event.target as Element).closest('.agenda-menu-dropdown')) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenuId]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h1>
          <p className="text-gray-500 mt-1">Kelola jadwal kegiatan pimpinan.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border">
          <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-2 hover:bg-gray-100 rounded-md text-gray-900"><ChevronLeft className="w-5 h-5"/></button>
          <span className="px-4 font-medium text-gray-900">{monthNames[currentDate.getMonth()]}</span>
          <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-2 hover:bg-gray-100 rounded-md text-gray-900"><ChevronRight className="w-5 h-5"/></button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* KOLOM KIRI: Kalender */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border shadow-sm">
            <div className="grid grid-cols-7 mb-4 text-center text-blue-600 font-bold">
              {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, idx) => {
                if (!day) return <div key={idx} className="h-24" />;
                const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const hasEvent = agendas.some(a => a.date === dateStr);
                const isSelected = selectedDate === dateStr;
                return (
                  <div key={idx} onClick={() => setSelectedDate(dateStr)}
                    className={`h-24 border rounded-xl p-2 cursor-pointer transition-all flex flex-col justify-between ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:border-blue-300'} ${hasEvent ? 'bg-blue-50/50' : 'bg-white'}`}>
                    <span className={`text-sm font-bold ${isSelected ? 'text-blue-600' : 'text-gray-700'}`}>{day}</span>
                    {hasEvent && <div className="w-2 h-2 bg-blue-500 rounded-full self-end mb-1"></div>}
                  </div>
                );
              })}
            </div>
        </div>

        {/* KOLOM KANAN: List Agenda (DIPERBESAR & LEBIH JELAS) */}
        <div className="bg-white p-6 rounded-3xl border shadow-sm h-full flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-bold text-gray-800 text-xl">Agenda Harian</h3>
              <p className="text-sm text-gray-500 mt-1">{displayDate}</p>
            </div>
            {isAdmin && (
              <button onClick={() => { closeModal(); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg shadow-blue-200">
                <Plus className="w-4 h-4" /> Tambah
              </button>
            )}
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
            {loading ? <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-500 w-8 h-8"/></div> : 
             filteredAgendas.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-gray-400 font-medium">Tidak ada agenda.</p>
                </div>
             ) : 
             filteredAgendas.map((agenda) => (
                <div key={agenda.id} className="relative p-6 bg-white rounded-2xl border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md transition-all group">
                  {/* Garis Aksen Kiri */}
                  <div className="absolute left-0 top-4 bottom-4 w-1.5 bg-blue-500 rounded-r-full"></div>
                  
                  <div className="pl-4 pr-8">
                    {/* JUDUL BESAR */}
                    <h4 className="font-bold text-gray-900 text-lg leading-tight mb-3">{agenda.title}</h4>
                    
                    {/* DESKRIPSI (DITAMPILKAN & JELAS) */}
                    {agenda.description && (
                      <div className="mb-4 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100 leading-relaxed">
                        <div className="flex gap-2 items-start">
                           <AlignLeft className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0"/>
                           <p>{agenda.description}</p>
                        </div>
                      </div>
                    )}

                    {/* WAKTU & LOKASI (DIPERBESAR) */}
                    <div className="flex flex-col gap-2 text-sm">
                      <div className="flex items-center gap-3 text-gray-700 font-medium">
                        <div className="p-1.5 bg-blue-50 rounded-md text-blue-600"><Clock className="w-4 h-4"/></div>
                        <span>{agenda.time?.slice(0, 5)} {agenda.end_time ? `- ${agenda.end_time.slice(0, 5)}` : ''} WIB</span>
                      </div>
                      
                      {agenda.location && (
                        <div className="flex items-center gap-3 text-gray-600">
                          <div className="p-1.5 bg-gray-100 rounded-md text-gray-500"><MapPin className="w-4 h-4"/></div>
                          <span>{agenda.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* DROPDOWN MENU ADMIN (TITIK TIGA) */}
                  {isAdmin && (
                    <div className="absolute top-4 right-4">
                      <button onClick={() => toggleMenu(agenda.id)} className="agenda-menu-button p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      
                      {openMenuId === agenda.id && (
                        <div className="agenda-menu-dropdown absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-20 animate-in fade-in zoom-in duration-200 origin-top-right">
                          <button onClick={() => handleEdit(agenda)} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left">
                            <Pencil className="w-4 h-4 text-gray-500" /> Edit
                          </button>
                          <button onClick={() => openDeleteModal(agenda.id)} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left">
                            <Trash2 className="w-4 h-4 text-red-500" /> Hapus
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            }
          </div>
        </div>
      </div>

      {/* --- MODAL TAMBAH/EDIT --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/30 backdrop-blur-sm p-4 transition-all">
          <div className="bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl animate-in fade-in zoom-in duration-300 border border-white/50">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{editingId ? 'Edit Agenda' : 'Agenda Baru'}</h2>
                <p className="text-gray-400 text-sm mt-1">Lengkapi detail kegiatan di bawah ini.</p>
              </div>
              <button onClick={closeModal} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"><X className="w-5 h-5 text-gray-500"/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center justify-between">
                <span className="text-xs font-bold text-blue-500 uppercase tracking-wider">Tanggal</span>
                <span className="text-lg font-bold text-blue-900">
                  {selectedDate ? new Date(selectedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 mb-1 block">Judul Kegiatan</label>
                <input required type="text" className="w-full bg-gray-50 border-gray-200 border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 mb-1 block">Mulai</label>
                  <input required type="time" className="w-full bg-gray-50 border-gray-200 border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium text-gray-900"
                    value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 mb-1 block">Selesai</label>
                  <input required type="time" className="w-full bg-gray-50 border-gray-200 border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium text-gray-900"
                    value={formData.end_time} onChange={e => setFormData({...formData, end_time: e.target.value})} />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 mb-1 block">Lokasi</label>
                <input type="text" className="w-full bg-gray-50 border-gray-200 border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
                  value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1 mb-1 block">Catatan / Deskripsi</label>
                <textarea className="w-full bg-gray-50 border-gray-200 border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all font-medium text-gray-900 h-24 placeholder:text-gray-400 resize-none"
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              
              <button disabled={isSubmitting} type="submit" className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200">
                {isSubmitting ? 'Menyimpan...' : 'Simpan Data'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL HAPUS --- */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/30 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm p-8 shadow-2xl animate-in fade-in zoom-in duration-300 border border-white/50 text-center">
             <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-8 h-8 text-red-500" />
             </div>
             <h3 className="text-2xl font-bold text-gray-900 mb-2">Hapus Item?</h3>
             <p className="text-gray-500 mb-8 leading-relaxed">
               Tindakan ini permanen. Data yang dihapus tidak bisa dikembalikan lagi.
             </p>
             <div className="flex gap-3">
               <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors">
                 Batal
               </button>
               <button onClick={executeDelete} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all hover:scale-105">
                 Ya, Hapus
               </button>
             </div>
          </div>
        </div>
      )}

    </div>
  );
}