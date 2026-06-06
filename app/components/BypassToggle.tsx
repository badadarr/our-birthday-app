'use client';

import { useState, useSyncExternalStore } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const emptySubscribe = () => () => {};
const getCookie = () => typeof document !== 'undefined' ? document.cookie.includes('bypass_teaser=true') : false;
const getServerSnapshot = () => false;

export default function BypassToggle() {
    const router = useRouter();
    const pathname = usePathname();
    const [, setTick] = useState(0);

    const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
    const isBypassed = useSyncExternalStore(emptySubscribe, getCookie, getServerSnapshot);

    if (!mounted) return null;

    const toggleBypass = () => {
        const newValue = !isBypassed;
        document.cookie = `bypass_teaser=${newValue}; path=/;`;
        setTick(t => t + 1); // Memaksa re-render agar useSyncExternalStore membaca cookie baru secara instan
        
        if (newValue && pathname === '/teaser') {
            // Jika kita menyalakan bypass dan sedang di halaman teaser, langsung arahkan ke halaman utama
            router.push('/');
        } else {
            // Jika kita mematikan bypass (dan di halaman utama), refresh akan memicu proxy untuk redirect kembali ke teaser
            router.refresh();
        }
    };

    return (
        <div className="fixed bottom-0 right-0 p-4 z-[999] opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300">
            <button
                onClick={toggleBypass}
                className={`px-3 py-1.5 text-[10px] uppercase tracking-widest rounded-md border backdrop-blur-md transition-all duration-300 ${
                    isBypassed 
                        ? 'bg-amber-500/20 text-amber-500 border-amber-500/30 hover:bg-amber-500/30' 
                        : 'bg-white/5 text-white/30 border-white/10 hover:bg-white/10 hover:text-white/70'
                }`}
                title={isBypassed ? "Disable Bypass" : "Enable Bypass"}
            >
                {isBypassed ? 'Bypass: ON' : 'Bypass: OFF'}
            </button>
        </div>
    );
}
