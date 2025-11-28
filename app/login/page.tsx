'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Lock } from 'lucide-react';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';

// Import UI Components yang baru kita buat
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent, role: 'admin' | 'guest') => {
    e.preventDefault();
    setError('');

    if (role === 'guest') {
      Cookies.set('is_admin', 'false');
      router.push('/dashboard/pimpinan');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login gagal');
      }

      Cookies.set('is_admin', 'true');
      router.push('/dashboard/pimpinan');

    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-900">
      
      {/* --- LAYER 1: BACKGROUND IMAGE BLUR --- */}
      <div 
        className="absolute inset-0 z-0 scale-105 blur-[8px]"
        style={{
          backgroundImage: `url('https://pbs.twimg.com/media/EzADYSnVUAI8B8c.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay Gelap */}
        <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-gray-900/90 to-gray-900/50"></div>
      </div>

      {/* --- LAYER 2: LOGIN CARD (GLASSMORPHISM) --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md p-8 mx-4"
      >
        <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
          
          {/* Hiasan Cahaya */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-400/30 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-indigo-400/30 rounded-full blur-3xl pointer-events-none"></div>

          <div className="text-center mb-8 relative">
            <div className="flex justify-center mb-4">
                <Image 
                  src="/logo.png"  
                  alt="Logo DPAD"
                  width={80}       
                  height={64}      
                  className="w-20 h-16 object-contain drop-shadow-md" 
                  priority
                />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Agenda DPAD</h1>
            <p className="text-gray-500 mt-2 text-sm">Selamat datang, silakan masuk ke akun Anda.</p>
          </div>

          <form onSubmit={(e) => handleLogin(e, 'admin')} className="space-y-5 relative">
            
            {/* Input pakai Component UI */}
            <Input 
              icon={<User className="h-5 w-5" />}
              type="text"
              placeholder="Username Admin"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input 
              icon={<Lock className="h-5 w-5" />}
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="bg-red-50/80 border border-red-200 text-red-600 text-sm p-3 rounded-xl text-center font-medium"
              >
                {error}
              </motion.div>
            )}

            {/* Button pakai Component UI */}
            <Button 
              type="submit" 
              isLoading={isLoading}
              variant="primary"
            >
              {isLoading ? 'Sedang Masuk...' : 'Masuk sebagai Admin'}
            </Button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-sm bg-white/60 px-2 rounded-full backdrop-blur-md">atau</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <Button 
              type="button" 
              onClick={(e) => handleLogin(e, 'guest')}
              disabled={isLoading}
              variant="outline"
            >
              Masuk sebagai Tamu
            </Button>

          </form>
        </div>
         <p className="text-center text-white/60 text-xs mt-6 font-medium">
            © {new Date().getFullYear()} Sistem Informasi Agenda DPAD DIY. 
          </p>
      </motion.div>
    </div>
  );
}