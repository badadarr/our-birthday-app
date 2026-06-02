'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function DigitalLetter() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

    return (
        <section ref={containerRef} className="relative min-h-screen py-32 px-6 flex items-center justify-center z-10">
            <motion.div 
                style={{ y, opacity }}
                className="max-w-2xl mx-auto space-y-8 text-center md:text-left"
            >
                <p className="font-serif text-2xl md:text-4xl text-amber-900/90 leading-relaxed font-light">
                    My dearest,
                </p>
                <p className="font-serif text-xl md:text-2xl text-amber-900/80 leading-relaxed font-light">
                    The night transit has finally ended. What started as my day has now gently shifted into yours. Every passing minute was leading up to this exact moment.
                </p>
                <p className="font-serif text-xl md:text-2xl text-amber-900/80 leading-relaxed font-light">
                    As the morning light fills the room, I want you to know how much you mean to me. The world spins, the sun sets and rises, but my love for you remains a constant anchor.
                </p>
                <p className="font-serif text-xl md:text-2xl text-amber-900/80 leading-relaxed font-light">
                    Happy Birthday. Welcome to your special day.
                </p>
                <div className="pt-12">
                    <p className="font-serif text-2xl text-amber-900/90 italic">
                        With all my love,
                    </p>
                    <p className="font-serif text-2xl text-amber-900/90 mt-2">
                        Your Passenger
                    </p>
                </div>
            </motion.div>
        </section>
    );
}
