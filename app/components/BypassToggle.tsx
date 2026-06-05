'use client';

import { useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';

const emptySubscribe = () => () => {};
const getCookie = () => document.cookie.includes('bypass_teaser=true');
const getServerSnapshot = () => false;

export default function BypassToggle() {
    const router = useRouter();

    const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
    const isBypassed = useSyncExternalStore(emptySubscribe, getCookie, getServerSnapshot);

    if (!mounted) return null;

    const toggleBypass = () => {
        if (isBypassed) {
            document.cookie = "bypass_teaser=false; path=/;";
        } else {
            document.cookie = "bypass_teaser=true; path=/;";
        }
        router.refresh(); // Refresh agar middleware berjalan & useSyncExternalStore re-reads cookie
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
