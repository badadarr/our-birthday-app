'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '@/app/components/AudioPlayer';

const EASTER_EGGS = [
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
    }
];

export default function TeaserEasterEgg() {
    const [clickCount, setClickCount] = useState(0);
    const [activeEgg, setActiveEgg] = useState<typeof EASTER_EGGS[0] | null>(null);
    const sfxRef = useRef<HTMLAudioElement | null>(null);
    const { lowerVolume, restoreVolume } = useAudio();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const handleClick = () => {
            if (activeEgg) return; // Don't count clicks while an egg is showing
            setClickCount((prev) => prev + 1);
        };

        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, [activeEgg]);

    useEffect(() => {
        const egg = EASTER_EGGS.find((e) => e.clicks === clickCount);
        if (egg) {
            setActiveEgg(egg);
            lowerVolume();
            
            if (sfxRef.current) {
                sfxRef.current.src = egg.audio;
                sfxRef.current.currentTime = 0;
                sfxRef.current.play().catch(e => console.error("Easter egg audio play failed", e));
            }

            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                closeEgg();
            }, egg.duration);
        }
    }, [clickCount]);

    const closeEgg = () => {
        setActiveEgg(null);
        restoreVolume();
        if (sfxRef.current) {
            sfxRef.current.pause();
        }
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    return (
        <>
            <audio ref={sfxRef} />
            <AnimatePresence>
                {activeEgg && (
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
                            <img 
                                src={activeEgg.gif} 
                                alt="Funny GIF" 
                                className="w-full h-auto rounded-xl max-h-64 object-contain bg-gray-100"
                            />
                            <p className="text-gray-800 font-sans font-bold text-lg leading-snug">
                                {activeEgg.text}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                                (Tap anywhere to close)
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
