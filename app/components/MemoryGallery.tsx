'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const MOCK_MEMORIES = [
    { id: 1, text: "The day we met", date: "August 12, 2021", rotate: -2, note: "I couldn't stop looking at your smile." },
    { id: 2, text: "First late night talk", date: "September 5, 2021", rotate: 3, note: "We talked until 4 AM. Time just disappeared." },
    { id: 3, text: "Coffee dates", date: "October 14, 2021", rotate: -1, note: "You ordered that weird matcha thing." },
    { id: 4, text: "Walking under the stars", date: "November 20, 2021", rotate: 4, note: "Cold breeze, but my heart was so warm." },
    { id: 5, text: "Our favorite song", date: "December 31, 2021", rotate: -3, note: "Singing terribly in the car together." },
    { id: 6, text: "First date at pizza place", date: "January 15, 2022", rotate: 2, note: "You had cheese on your nose. So cute." },
    { id: 7, text: "Makan apa aja ya hmm", date: "February 28, 2022", rotate: -4, note: "The hardest question we face daily." },
    { id: 8, text: "Motoran keliling Kota Depok", date: "March 10, 2022", rotate: 1, note: "Lost but perfectly fine with it." },
    { id: 9, text: "First Kiss", date: "April 5, 2022", rotate: -2, note: "Best moment of my entire life." },
];

function PolaroidCard({ memory, index }: { memory: typeof MOCK_MEMORIES[0], index: number }) {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, rotate: memory.rotate - 5 }}
            whileInView={{ opacity: 1, y: 0, rotate: memory.rotate }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ 
                duration: 0.8, 
                delay: (index % 3) * 0.15,
                type: "spring", 
                stiffness: 100 
            }}
            whileHover={{ scale: 1.05, zIndex: 20 }}
            className="break-inside-avoid mb-6 md:mb-10 relative cursor-pointer perspective-[1000px]"
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
                className="w-full relative [transform-style:preserve-3d]"
            >
                {/* Front of Polaroid */}
                <div 
                    className="bg-white p-3 md:p-4 shadow-[0_10px_30px_rgba(120,53,15,0.08)] hover:shadow-[0_20px_40px_rgba(120,53,15,0.12)] rounded-sm flex flex-col items-center transition-shadow [backface-visibility:hidden]"
                >
                    <div className="w-full aspect-[4/5] bg-amber-50/50 rounded border border-amber-900/10 flex items-center justify-center overflow-hidden mb-4 relative">
                        <Heart className="w-10 h-10 md:w-12 md:h-12 text-amber-900/20" strokeWidth={1.5} />
                        <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay pointer-events-none" />
                    </div>
                    
                    <div className="flex items-center justify-center text-center px-2 min-h-[3rem]">
                        <p className="font-serif text-amber-900/80 text-base md:text-lg italic leading-tight">
                            {memory.text}
                        </p>
                    </div>
                </div>

                {/* Back of Polaroid */}
                <div 
                    className="absolute inset-0 bg-[#fdfaf3] p-6 shadow-[0_10px_30px_rgba(120,53,15,0.08)] rounded-sm flex flex-col justify-center items-center text-center [backface-visibility:hidden]"
                    style={{ transform: "rotateY(180deg)" }}
                >
                    {/* Paper Texture Overlay */}
                    <div className="absolute inset-0 bg-noise opacity-[0.05] mix-blend-overlay pointer-events-none" />
                    <div className="absolute inset-0 bg-amber-900/[0.02] pointer-events-none" />
                    
                    <p className="font-handwriting text-2xl md:text-3xl text-amber-900/90 leading-relaxed mb-4 -rotate-2">
                        &ldquo;{memory.note}&rdquo;
                    </p>
                    
                    <p className="font-serif text-xs uppercase tracking-widest text-amber-900/50 absolute bottom-6">
                        {memory.date}
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default function MemoryGallery() {
    return (
        <section className="relative w-full py-24 md:py-32 z-10">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 md:gap-10">
                    {MOCK_MEMORIES.map((memory, index) => (
                        <PolaroidCard key={memory.id} memory={memory} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}
