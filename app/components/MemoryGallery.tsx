'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const MOCK_MEMORIES = [
    { id: 1, text: "The day we met", rotate: -2 },
    { id: 2, text: "First late night talk", rotate: 3 },
    { id: 3, text: "Coffee dates", rotate: -1 },
    { id: 4, text: "Walking under the stars", rotate: 4 },
    { id: 5, text: "Our favorite song", rotate: -3 },
    { id: 6, text: "First date at pizza place", rotate: 2 },
    { id: 7, text: "Makan apa aja ya hmm", rotate: -4 },
    { id: 8, text: "Motoran keliling Kota Depok", rotate: 1 },
    { id: 9, text: "First Kiss", rotate: -2 },
];

export default function MemoryGallery() {
    return (
        <section className="relative w-full py-24 md:py-32 z-10">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                {/* Judul Opsional (jika ingin) */}
                {/* <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center font-serif text-3xl md:text-4xl text-amber-900/80 mb-16 italic"
                >
                    Our Memories
                </motion.h2> */}

                {/* CSS Columns untuk efek Masonry Collage */}
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 md:gap-10">
                    {MOCK_MEMORIES.map((memory, index) => (
                        <motion.div
                            key={memory.id}
                            initial={{ opacity: 0, y: 50, rotate: memory.rotate - 5 }}
                            whileInView={{ opacity: 1, y: 0, rotate: memory.rotate }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ 
                                duration: 0.8, 
                                delay: (index % 3) * 0.15, // Stagger effect berdasarkan kolom
                                type: "spring", 
                                stiffness: 100 
                            }}
                            whileHover={{ scale: 1.05, rotate: 0, zIndex: 20 }}
                            className="break-inside-avoid mb-6 md:mb-10 relative bg-white p-3 md:p-4 shadow-[0_10px_30px_rgba(120,53,15,0.08)] hover:shadow-[0_20px_40px_rgba(120,53,15,0.12)] rounded-sm flex flex-col items-center cursor-pointer transition-shadow"
                        >
                            {/* Frame Foto Polaroid */}
                            <div className="w-full aspect-[4/5] bg-amber-50/50 rounded border border-amber-900/10 flex items-center justify-center overflow-hidden mb-4 relative">
                                {/* Placeholder for Image using Lucide Icon */}
                                <Heart className="w-10 h-10 md:w-12 md:h-12 text-amber-900/20" strokeWidth={1.5} />
                                
                                {/* Efek tekstur kertas ringan */}
                                <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay pointer-events-none" />
                            </div>
                            
                            {/* Caption Foto */}
                            <div className="flex items-center justify-center text-center px-2 min-h-[3rem]">
                                <p className="font-serif text-amber-900/80 text-base md:text-lg italic leading-tight">
                                    {memory.text}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
