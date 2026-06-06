'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function BypassToggle() {
    const router = useRouter();
    const pathname = usePathname();
    const [isBypassed, setIsBypassed] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setIsBypassed(document.cookie.includes('bypass_teaser=true'));
    }, []);

    if (!mounted) return null;

    const toggleBypass = () => {
        const newValue = !isBypassed;
        setIsBypassed(newValue);
        document.cookie = `bypass_teaser=${newValue}; path=/;`;
        
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
