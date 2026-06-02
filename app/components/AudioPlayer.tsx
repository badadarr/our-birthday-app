// components/AudioPlayer.tsx
'use client';

import React, { createContext, useContext, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AudioContextType {
    triggerFadeIn: () => void;
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

    return (
        <AudioContext.Provider value={{ triggerFadeIn }}>
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
                        className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 text-slate-200"
                    >
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5, duration: 1 }}
                            className="text-2xl md:text-4xl font-light tracking-widest mb-8 text-center"
                        >
                            The Night Transit
                        </motion.h1>

                        <motion.button
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 1, duration: 0.8 }}
                            onClick={handleStartJourney}
                            className="px-8 py-3 rounded-full border border-slate-500/50 bg-slate-900/50 hover:bg-slate-800 transition-all duration-300 tracking-widest text-sm uppercase shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        >
                            Mulai Perjalanan
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            {children}
        </AudioContext.Provider>
    );
}