// components/AudioPlayer.tsx
'use client';

import React, { createContext, useContext, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Anchor } from 'lucide-react';

interface AudioContextType {
    triggerFadeIn: () => void;
    lowerVolume: () => void;
    restoreVolume: () => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) throw new Error('useAudio must be used within AudioProvider');
    return context;
};

export default function AudioProvider({ children }: { children: React.ReactNode }) {
    const [hasInteracted, setHasInteracted] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handleStartJourney = () => {
        setHasInteracted(true);
        if (audioRef.current) {
            audioRef.current.volume = 0.05; // Mulai dengan sangat pelan
            audioRef.current.play().catch((err) => {
                if (err.name === 'NotSupportedError') {
                    console.warn("Audio play failed: No supported sources. Please ensure 'public/audio/blue-yungkai.mp3' exists.");
                } else {
                    console.warn("Audio play failed:", err);
                }
            });
        }
    };

    const triggerFadeIn = () => {
        if (!audioRef.current) return;

        let currentVolume = audioRef.current.volume;
        const targetVolume = 0.7;
        const fadeDuration = 3000; // 3 detik
        const steps = 30; // 30 iterasi
        const stepIncrement = (targetVolume - currentVolume) / steps;
        const intervalTime = fadeDuration / steps;

        const fadeInterval = setInterval(() => {
            currentVolume += stepIncrement;
            if (currentVolume >= targetVolume) {
                currentVolume = targetVolume;
                clearInterval(fadeInterval);
            }
            if (audioRef.current) {
                audioRef.current.volume = currentVolume;
            }
        }, intervalTime);
    };

    const lowerVolume = () => {
        if (!audioRef.current) return;
        
        let currentVolume = audioRef.current.volume;
        const targetVolume = 0.1;
        const fadeDuration = 2000; // 2 seconds
        const steps = 20;
        const stepIncrement = (currentVolume - targetVolume) / steps;
        const intervalTime = fadeDuration / steps;

        const fadeInterval = setInterval(() => {
            currentVolume -= stepIncrement;
            if (currentVolume <= targetVolume) {
                currentVolume = targetVolume;
                clearInterval(fadeInterval);
            }
            if (audioRef.current) {
                audioRef.current.volume = currentVolume;
            }
        }, intervalTime);
    };

    const restoreVolume = () => {
        if (!audioRef.current) return;
        
        let currentVolume = audioRef.current.volume;
        const targetVolume = 0.7;
        const fadeDuration = 2000; // 2 seconds
        const steps = 20;
        const stepIncrement = (targetVolume - currentVolume) / steps;
        const intervalTime = fadeDuration / steps;

        const fadeInterval = setInterval(() => {
            currentVolume += stepIncrement;
            if (currentVolume >= targetVolume) {
                currentVolume = targetVolume;
                clearInterval(fadeInterval);
            }
            if (audioRef.current) {
                audioRef.current.volume = currentVolume;
            }
        }, intervalTime);
    };

    return (
        <AudioContext.Provider value={{ triggerFadeIn, lowerVolume, restoreVolume }}>
            {/* Hidden Audio Element */}
            <audio 
                ref={audioRef} 
                loop 
                src="/audio/blue-yungkai.mp3" 
                preload="auto" 
                onError={(e) => {
                    console.warn("Audio file missing or unsupported: 'public/audio/blue-yungkai.mp3'");
                    // Remove src to prevent continuous NotSupportedError spam
                    e.currentTarget.removeAttribute("src");
                }}
            />

            {/* Autoplay Gateway Overlay */}
            <AnimatePresence>
                {!hasInteracted && (
                    <motion.div
                        initial={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 1.5, ease: 'easeInOut' } }}
                        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020810] text-slate-200"
                    >
                        {/* Subtle star dots on the landing screen */}
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            {Array.from({ length: 30 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    animate={{ opacity: [0.15, 0.6, 0.15] }}
                                    transition={{ repeat: Infinity, duration: 2 + (i % 3), delay: (i % 5) * 0.5 }}
                                    className="absolute w-[2px] h-[2px] rounded-full bg-white"
                                    style={{
                                        left: `${(i * 13.7 + 5) % 100}%`,
                                        top: `${(i * 8.9 + 3) % 100}%`,
                                    }}
                                />
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 0.6, scale: 1 }}
                            transition={{ delay: 0.2, duration: 1.5 }}
                            className="mb-6 text-cyan-300 drop-shadow-[0_0_15px_rgba(103,232,249,0.3)]"
                        >
                            <Anchor className="w-10 h-10" strokeWidth={1} />
                        </motion.div>

                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="text-2xl md:text-4xl font-light tracking-[0.2em] mb-3 text-center"
                        >
                            The Night Voyage
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            transition={{ delay: 1, duration: 1 }}
                            className="text-[11px] tracking-[0.2em] uppercase text-slate-500 mb-10"
                        >
                            June 13 → June 14
                        </motion.p>

                        <motion.button
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 1.2, duration: 0.8 }}
                            onClick={handleStartJourney}
                            className="group relative px-10 py-3.5 rounded-full border border-cyan-400/20 bg-cyan-500/5 hover:bg-cyan-500/10 transition-all duration-500 tracking-[0.2em] text-xs uppercase text-cyan-200/80 hover:text-cyan-100 shadow-[0_0_30px_rgba(103,232,249,0.05)] hover:shadow-[0_0_40px_rgba(103,232,249,0.15)]"
                        >
                            <span className="relative z-10">Mulai Perjalanan</span>
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            {children}
        </AudioContext.Provider>
    );
}