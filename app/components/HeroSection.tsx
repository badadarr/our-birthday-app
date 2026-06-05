'use client';

import { useState, useEffect } from 'react';
import { motion, type Variants, AnimatePresence } from 'framer-motion';

export default function HeroSection() {
    const [phase, setPhase] = useState<'false-start' | 'main'>('false-start');

    useEffect(() => {
        const timer = setTimeout(() => {
            setPhase('main');
        }, 3500); // 3s hold + 0.5s fade out
        return () => clearTimeout(timer);
    }, []);

    const mainText = "The ship has docked. Welcome to your day, My Aas Sayangg Sheng shengg huu.";
    const words = mainText.split(" ");

    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.5 },
        },
    };

    const child: Variants = {
        visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                type: "spring",
                damping: 12,
                stiffness: 100,
            },
        },
        hidden: {
            opacity: 0,
            y: 20,
            filter: "blur(10px)",
        },
    };

    return (
        <section className="relative w-full h-screen flex flex-col items-center justify-center px-6 md:px-20 text-center z-10">
            
            <AnimatePresence mode="wait">
                {phase === 'false-start' && (
                    <motion.div
                        key="false-start"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="absolute max-w-2xl px-4"
                    >
                        <p className="text-xl md:text-3xl font-serif text-amber-900/60 tracking-wide font-light leading-snug italic">
                            Setelah mengarungi 7 samudra dan hampir tenggelam karena kaptennya lupa bawa kompas...
                        </p>
                    </motion.div>
                )}

                {phase === 'main' && (
                    <motion.div
                        key="main"
                        variants={container}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-wrap justify-center gap-x-2 md:gap-x-3"
                    >
                        {words.map((word, index) => (
                            <motion.span
                                variants={child}
                                key={index}
                                className="text-3xl md:text-5xl lg:text-7xl font-serif text-amber-900 tracking-wide font-light leading-snug"
                                style={{ textShadow: '0 4px 20px rgba(251, 191, 36, 0.2)' }}
                            >
                                {word}
                            </motion.span>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {phase === 'main' && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 3, duration: 2, ease: "easeOut" }}
                    className="absolute bottom-12 flex flex-col items-center"
                >
                    <p className="text-amber-800/60 uppercase tracking-[0.3em] text-xs mb-4">Scroll softly</p>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        className="w-[1px] h-12 bg-gradient-to-b from-amber-800/50 to-transparent"
                    />
                </motion.div>
            )}
        </section>
    );
}
