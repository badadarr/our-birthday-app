'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BypassToggle() {
    const router = useRouter();
    const [isBypassed, setIsBypassed] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Cek cookie saat ini
        const isBypassedCookie = document.cookie.includes('bypass_teaser=true');
        setIsBypassed(isBypassedCookie);
    }, []);

    if (!mounted) return null;

    const toggleBypass = () => {
        if (isBypassed) {
            document.cookie = "bypass_teaser=false; path=/;";
            setIsBypassed(false);
            router.refresh(); // Refresh agar middleware berjalan
        } else {
            document.cookie = "bypass_teaser=true; path=/;";
            setIsBypassed(true);
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
