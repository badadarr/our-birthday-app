'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const MOCK_MEMORIES = [
    { id: 1, text: "The day we met", rotate: -2, yOffset: 0 },
    { id: 2, text: "First late night talk", rotate: 3, yOffset: 40 },
    { id: 3, text: "Coffee dates", rotate: -1, yOffset: -20 },
    { id: 4, text: "Walking under the stars", rotate: 4, yOffset: 60 },
    { id: 5, text: "Our favorite song", rotate: -3, yOffset: 10 },
];

export default function MemoryGallery() {
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
    });

    const x = useTransform(scrollYProgress, [0, 1], ["10%", "-70%"]);

    return (
        <section ref={targetRef} className="relative h-[300vh] bg-transparent z-10">
            <div className="sticky top-0 h-screen flex items-center overflow-hidden">
                <motion.div style={{ x }} className="flex gap-12 px-20">
                    {MOCK_MEMORIES.map((memory) => (
                        <motion.div
                            key={memory.id}
                            style={{ y: memory.yOffset }}
                            whileHover={{ scale: 1.05, rotate: 0, zIndex: 20 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="relative w-72 h-96 shrink-0 bg-white p-4 shadow-xl rounded-sm flex flex-col"
                        >
                            <div className="w-full flex-1 bg-amber-50/50 rounded border border-amber-900/10 flex items-center justify-center overflow-hidden">
                                {/* Placeholder for Image */}
                                <div className="text-amber-900/20 text-4xl font-light">♥</div>
                            </div>
                            <div className="h-16 flex items-center justify-center">
                                <p className="font-serif text-amber-900/80 text-lg italic">{memory.text}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
