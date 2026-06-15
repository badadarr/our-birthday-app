'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useAudio } from './AudioPlayer';

export default function SecretVoiceNote() {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const { lowerVolume, restoreVolume } = useAudio();

    const handlePlayVoiceNote = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsPlaying(false);
            restoreVolume();
        } else {
            lowerVolume();
            setIsPlaying(true);
            
            // Adding a small delay to let background music fade out before speaking
            setTimeout(() => {
                if (audioRef.current) {
                    audioRef.current.play().catch((err) => {
                        console.warn("Voice note play failed:", err);
                        setIsPlaying(false);
                        restoreVolume();
                    });
                }
            }, 1000);
        }
    };

    const handleEnded = () => {
        setIsPlaying(false);
        restoreVolume();
    };

    return (
        <div className="flex flex-col items-center justify-center mt-20 mb-10">
            <audio
                ref={audioRef}
                src="/audio/secreto-magic-voice-badar.mp4"
                onEnded={handleEnded}
                preload="auto"
            />

            <p className="font-serif text-sm text-amber-900/40 italic mb-6">
                Listen closely...
            </p>

            <motion.button
                onClick={handlePlayVoiceNote}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={isPlaying ? {
                    scale: [1, 1.1, 1],
                    boxShadow: [
                        "0px 0px 0px rgba(244, 63, 94, 0)",
                        "0px 0px 20px rgba(244, 63, 94, 0.4)",
                        "0px 0px 0px rgba(244, 63, 94, 0)"
                    ]
                } : {
                    boxShadow: [
                        "0px 0px 0px rgba(244, 63, 94, 0)",
                        "0px 0px 10px rgba(244, 63, 94, 0.2)",
                        "0px 0px 0px rgba(244, 63, 94, 0)"
                    ]
                }}
                transition={isPlaying ? {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                } : {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors duration-500 ${
                    isPlaying 
                        ? 'bg-rose-50 border border-rose-200' 
                        : 'bg-white/50 border border-amber-900/10 hover:bg-rose-50 hover:border-rose-200'
                }`}
            >
                <Heart 
                    className={`w-6 h-6 transition-colors duration-500 ${
                        isPlaying ? 'text-rose-400 fill-rose-400' : 'text-amber-900/40'
                    }`}
                    strokeWidth={1.5} 
                />
            </motion.button>
        </div>
    );
}
