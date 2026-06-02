'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function TransitionSeparator() {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"]
    });

    const pathLength = useTransform(scrollYProgress, [0.1, 0.5], [0, 1]);
    const opacity = useTransform(scrollYProgress, [0.3, 0.6], [0, 1]);
    const yOffset = useTransform(scrollYProgress, [0.3, 0.7], [30, 0]);

    // Parallax effect for the background elements
    const y1 = useTransform(scrollYProgress, [0, 1], [-100, 100]);
    const y2 = useTransform(scrollYProgress, [0, 1], [100, -100]);

    return (
        <div ref={ref} className="relative w-full h-[60vh] flex flex-col items-center justify-center overflow-hidden">
            {/* Soft glowing orb in the center representing the rising sun */}
            <motion.div 
                style={{ opacity }}
                className="absolute w-[40vw] max-w-[400px] aspect-square rounded-full bg-gradient-to-tr from-amber-200/20 to-pink-200/20 blur-[60px]" 
            />

            {/* Decorative parallax text behind */}
            <motion.div style={{ y: y1 }} className="absolute left-[10%] top-[20%] text-amber-900/5 font-serif italic text-4xl whitespace-nowrap -rotate-12 pointer-events-none">
                the morning light
            </motion.div>
            <motion.div style={{ y: y2 }} className="absolute right-[10%] bottom-[20%] text-amber-900/5 font-serif italic text-4xl whitespace-nowrap rotate-12 pointer-events-none">
                a new chapter
            </motion.div>

            {/* The elegant vertical line drawing itself */}
            <svg width="2" height="180" viewBox="0 0 2 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="z-10">
                <motion.line 
                    x1="1" y1="0" x2="1" y2="180" 
                    stroke="url(#gradient)" 
                    strokeWidth="2"
                    style={{ pathLength }}
                />
                <defs>
                    <linearGradient id="gradient" x1="1" y1="0" x2="1" y2="180" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#b45309" stopOpacity="0" />
                        <stop offset="0.5" stopColor="#b45309" stopOpacity="0.4" />
                        <stop offset="1" stopColor="#b45309" stopOpacity="0" />
                    </linearGradient>
                </defs>
            </svg>
            
            {/* The graceful text reveal */}
            <motion.div style={{ opacity, y: yOffset }} className="mt-10 text-center z-10">
                <p className="font-serif italic text-amber-800/60 text-2xl md:text-3xl tracking-widest">
                    A new day begins...
                </p>
                <div className="mt-6 flex items-center justify-center gap-4">
                    <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-amber-800/30" />
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-800/30" />
                    <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-amber-800/30" />
                </div>
            </motion.div>
        </div>
    );
}
