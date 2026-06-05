'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '@/app/components/AudioPlayer';

type EasterEgg = {
    clicks: number;
    gif: string;
    audio: string;
    audio2?: string;
    text: string;
    duration: number;
    isSystemError?: boolean;
};

const EASTER_EGGS: EasterEgg[] = [
    {
        clicks: 3,
        gif: '/gif/question-mark-moodman.gif',
        audio: '/audio/wrong-price-is-right.mp3',
        text: 'Sabar, belum hari H! Ngapain di-klik?',
        duration: 4000
    },
    {
        clicks: 8,
        gif: '/gif/bahlil-bersinar.gif',
        audio: '/audio/yes-roundabout.mp3',
        text: 'Bersinar dulu bosku sambil nunggu waktu...',
        duration: 6000
    },
    {
        clicks: 15,
        gif: '/gif/discpicable-me-gif.gif',
        audio: '/audio/Monkeys-Spinning-Monkeys(chosic.com).mp3',
        text: 'Bosan nunggu? Mending kita joget bareng minion 🐒',
        duration: 7000
    },
    {
        clicks: 25,
        gif: '/gif/question-mark-moodman.gif',
        audio: '/audio/curb-your-enthusiasm.mp3',
        text: 'Masih aja nge-klik... Mending kamu tidur deh.',
        duration: 8000
    },
    {
        clicks: 35,
        gif: '/gif/bahlil-bersinar.gif',
        audio: '/audio/mission-impossible-sound-effect.mp3',
        text: 'Misi rahasia: Berhenti nge-klik layar ini!',
        duration: 6000
    },
    {
        clicks: 50,
        gif: '/gif/discpicable-me-gif.gif',
        audio: '/audio/wrong-price-is-right.mp3',
        audio2: '/audio/Monkeys-Spinning-Monkeys(chosic.com).mp3',
        text: 'SYSTEM ERROR: USER TOO ANNOYING',
        duration: 4000,
        isSystemError: true
    }
];

export default function TeaserEasterEgg() {
    const [clickCount, setClickCount] = useState(0);
    const [activeEgg, setActiveEgg] = useState<EasterEgg | null>(null);
    const [systemErrorPhase, setSystemErrorPhase] = useState<1 | 2>(1);
    
    const sfxRef = useRef<HTMLAudioElement | null>(null);
    const { lowerVolume, restoreVolume } = useAudio();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const closeEgg = useCallback(() => {
        setActiveEgg(null);
        restoreVolume();
        if (sfxRef.current) sfxRef.current.pause();
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }, [restoreVolume]);

    const handleClick = useCallback(() => {
        if (activeEgg) return;
        const next = clickCount + 1;
        setClickCount(next);
        const egg = EASTER_EGGS.find((e) => e.clicks === next);
        if (!egg) return;
        
        setActiveEgg(egg);
        lowerVolume();

        if (egg.isSystemError) {
            setSystemErrorPhase(1);
        }

        if (sfxRef.current) {
            sfxRef.current.src = egg.audio;
            sfxRef.current.currentTime = 0;
            sfxRef.current.play().catch(e => console.error('Easter egg audio play failed', e));
        }

        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        if (egg.isSystemError) {
            timeoutRef.current = setTimeout(() => {
                setSystemErrorPhase(2);
                if (sfxRef.current && egg.audio2) {
                    sfxRef.current.src = egg.audio2;
                    sfxRef.current.currentTime = 0;
                    sfxRef.current.play().catch(e => console.error(e));
                }
                
                // Phase 2 lasts for 3 seconds before closing
                timeoutRef.current = setTimeout(closeEgg, 3000);
            }, 1000); // Phase 1 (Error screen) lasts for 1 second
        } else {
            timeoutRef.current = setTimeout(closeEgg, egg.duration);
        }
    }, [activeEgg, clickCount, closeEgg, lowerVolume]);

    useEffect(() => {
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, [handleClick]);

    return (
        <>
            <audio ref={sfxRef} />
            <AnimatePresence>
                {/* 1. Normal Easter Egg OR Phase 2 of System Error */}
                {activeEgg && (!activeEgg.isSystemError || systemErrorPhase === 2) && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 50 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-auto"
                        onClick={closeEgg}
                    >
                        <motion.div 
                            className="bg-white p-4 md:p-6 rounded-2xl shadow-2xl max-w-sm w-full flex flex-col items-center text-center gap-4 border-4 border-amber-300 transform rotate-1"
                            animate={{ rotate: [-1, 2, -1, 1, 0] }}
                            transition={{ duration: 0.5 }}
                        >
                            <Image
                                src={activeEgg.gif}
                                alt="Funny GIF"
                                width={400}
                                height={256}
                                unoptimized
                                className="w-full h-auto rounded-xl max-h-64 object-contain bg-gray-100"
                            />
                            <p className="text-gray-800 font-sans font-bold text-lg leading-snug">
                                {activeEgg.isSystemError ? "Bercanda woy! Joget dulu aja 🐒" : activeEgg.text}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                                (Tap anywhere to close)
                            </p>
                        </motion.div>
                    </motion.div>
                )}

                {/* 2. Phase 1 of System Error (Black Screen) */}
                {activeEgg && activeEgg.isSystemError && systemErrorPhase === 1 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-black flex items-center justify-center pointer-events-auto"
                        onClick={closeEgg}
                    >
                        <motion.h1 
                            animate={{ opacity: [1, 0, 1, 0.5, 1], x: [-5, 5, -2, 2, 0] }}
                            transition={{ repeat: Infinity, duration: 0.1 }}
                            className="text-red-600 font-mono text-3xl md:text-5xl font-bold tracking-widest text-center px-4"
                        >
                            SYSTEM ERROR:<br/>USER TOO ANNOYING
                        </motion.h1>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
