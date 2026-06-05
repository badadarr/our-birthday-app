'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sailboat } from 'lucide-react';

const HONK_MESSAGES = [
    'TUUUT! 🚢',
    'Aye aye captain! ⚓',
    'Sabar, masih berlayar... 🌊',
    'Jangan ganggu kapten! 😤',
    'Kita hampir sampai! ✨',
    'HONK HONK! 📯',
    '*splash* 💦',
    'Bensin abis, kapten lagi ngayuh pake sendok garpu 🍴',
    'Jangan diklik terus, kapalnya pusing! 🥴',
    'Sabar, kapalnya lagi antre di pelabuhan Merak 🚗',
    'Kapten lagi nelpon SPBU terdekat... 📞',
    'GPS-nya bilang: "Recalculating..." 🗺️',
    'Kapalnya minta istirahat 5 menit ⏸️',
    'Layarnya sobek, kapten lagi jahit pake benang nylon 🧵',
    'Penumpang gelap detected: 1 kucing 🐱',
    'Wi-Fi kapal lemot, sabar ya... 📶',
];

export default function InteractiveBoat({ arrived }: { arrived: boolean }) {
    const [isTapped, setIsTapped] = useState(false);
    const [tapCount, setTapCount] = useState(0);
    const [showBubble, setShowBubble] = useState(false);
    const [bubbleText, setBubbleText] = useState('');
    const [splashes, setSplashes] = useState<{ id: number; x: number }[]>([]);
    const sfxRef = useRef<HTMLAudioElement | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const splashIdRef = useRef(0);

    const handleBoatTap = useCallback(() => {
        if (arrived) return;

        // Play honk sound
        if (sfxRef.current) {
            sfxRef.current.currentTime = 0;
            sfxRef.current.volume = 0.4;
            sfxRef.current.play().catch(() => {});
        }

        // Trigger tap animation
        setIsTapped(true);
        setTimeout(() => setIsTapped(false), 400);

        // Show speech bubble
        const newCount = tapCount + 1;
        setTapCount(newCount);
        const msg = HONK_MESSAGES[newCount % HONK_MESSAGES.length];
        setBubbleText(msg);
        setShowBubble(true);

        // Spawn splash particles
        const newSplashes = Array.from({ length: 3 }).map(() => ({
            id: splashIdRef.current++,
            x: (Math.random() - 0.5) * 40,
        }));
        setSplashes((prev) => [...prev, ...newSplashes]);
        setTimeout(() => {
            setSplashes((prev) => prev.filter((s) => !newSplashes.find((ns) => ns.id === s.id)));
        }, 800);

        // Auto-hide bubble
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setShowBubble(false);
        }, 2000);
    }, [arrived, tapCount]);

    return (
        <div className="flex-1 px-3 relative flex items-center justify-center">
            <div className="h-[1px] w-full bg-gradient-to-r from-cyan-800/20 via-cyan-600/30 to-cyan-800/20" />

            {/* Honk SFX */}
            <audio ref={sfxRef} src="/audio/curb-your-enthusiasm.mp3" preload="auto" />

            {/* Speech bubble */}
            <AnimatePresence>
                {showBubble && (
                    <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.8 }}
                        animate={{ opacity: 1, y: -32, scale: 1 }}
                        exit={{ opacity: 0, y: -40, scale: 0.5 }}
                        className="absolute z-30 -top-2 bg-white text-gray-800 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap pointer-events-none"
                    >
                        {bubbleText}
                        {/* Speech bubble tail */}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Splash particles */}
            <AnimatePresence>
                {splashes.map((splash) => (
                    <motion.div
                        key={splash.id}
                        initial={{ opacity: 1, y: 0, x: splash.x, scale: 0.5 }}
                        animate={{ opacity: 0, y: -20, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                        className="absolute text-cyan-300 text-[8px] pointer-events-none z-20"
                    >
                        💧
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* The interactive boat */}
            <motion.button
                onClick={handleBoatTap}
                animate={
                    isTapped
                        ? { y: [-6, 2, -2, 0], rotateZ: [-15, 10, -5, 0], scale: [1.3, 0.9, 1.1, 1] }
                        : arrived
                            ? { x: 0, rotateZ: 0 }
                            : { x: [-8, 8, -8], rotateZ: [-4, 4, -4] }
                }
                transition={
                    isTapped
                        ? { duration: 0.4, ease: 'easeOut' }
                        : { repeat: Infinity, duration: 3.5, ease: 'easeInOut' }
                }
                whileHover={{ scale: 1.2, filter: 'drop-shadow(0 0 12px rgba(103,232,249,0.8))' }}
                whileTap={{ scale: 0.85 }}
                className="absolute text-cyan-400 bg-[#020810]/80 px-1.5 drop-shadow-[0_0_8px_rgba(103,232,249,0.5)] cursor-pointer z-20 outline-none border-none"
                aria-label="Tap the boat!"
            >
                <Sailboat className="w-5 h-5" strokeWidth={1.5} />
                
                {/* Glow ring on tap */}
                <AnimatePresence>
                    {isTapped && (
                        <motion.div
                            initial={{ opacity: 0.8, scale: 0.5 }}
                            animate={{ opacity: 0, scale: 2.5 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.6 }}
                            className="absolute inset-0 rounded-full border border-cyan-400/60 pointer-events-none"
                        />
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    );
}
