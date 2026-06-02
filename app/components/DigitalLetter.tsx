'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import SecretVoiceNote from './SecretVoiceNote';

function TypewriterText({ text, className, delayOffset = 0 }: { text: string, className?: string, delayOffset?: number }) {
    return (
        <motion.p 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
                visible: { transition: { staggerChildren: 0.03, delayChildren: delayOffset } }
            }}
            className={className}
        >
            {text.split('').map((char, index) => (
                <motion.span
                    key={`${char}-${index}`}
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1 }
                    }}
                >
                    {char}
                </motion.span>
            ))}
        </motion.p>
    );
}

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
                <TypewriterText 
                    text="My dearest," 
                    className="font-serif text-2xl md:text-4xl text-amber-900/90 leading-relaxed font-light" 
                />
                <TypewriterText 
                    text="The night voyage has finally ended. What started as my day has now gently shifted into yours. Every passing minute was leading up to this exact moment." 
                    className="font-serif text-xl md:text-2xl text-amber-900/80 leading-relaxed font-light" 
                    delayOffset={0.5}
                />
                <TypewriterText 
                    text="As the morning light fills the room, I want you to know how much you mean to me. The world spins, the sun sets and rises, but my love for you remains a constant anchor." 
                    className="font-serif text-xl md:text-2xl text-amber-900/80 leading-relaxed font-light" 
                    delayOffset={1}
                />
                <TypewriterText 
                    text="Happy Birthday. Welcome to your special day." 
                    className="font-serif text-xl md:text-2xl text-amber-900/80 leading-relaxed font-light" 
                    delayOffset={1.5}
                />

                {/* ── CAPCUT VIDEO EDIT SECTION ── */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 2, duration: 1 }}
                    className="relative my-16 mx-auto w-full max-w-3xl rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(120,53,15,0.15)] ring-1 ring-amber-900/10 bg-amber-100/30 flex items-center justify-center min-h-[300px] md:min-h-[400px]"
                >
                    <video 
                        controls 
                        playsInline
                        preload="metadata"
                        className="w-full h-auto max-h-[80vh] object-contain relative z-10"
                    >
                        {/* Ganti nama file ini dengan nama video Anda */}
                        <source src="/video/our-memory.mp4" type="video/mp4" />
                    </video>
                    
                    {/* Placeholder hint jika video belum ada */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-amber-900/50 p-6 text-center z-0">
                        <span className="text-4xl mb-4">🎞️</span>
                        <p className="text-base font-serif italic mb-2">
                            Frame otomatis menyesuaikan (Support 16:9 & 4:3)
                        </p>
                        <p className="text-xs">
                            Simpan video edit CapCut kamu di <br/>
                            <code className="bg-amber-900/10 px-1.5 py-0.5 rounded mt-2 inline-block">public/video/our-memory.mp4</code>
                        </p>
                    </div>
                </motion.div>

                <div className="pt-8">
                    <TypewriterText 
                        text="With all my love," 
                        className="font-serif text-2xl text-amber-900/90 italic" 
                        delayOffset={2.5}
                    />
                    <TypewriterText 
                        text="Your Fellow Voyager" 
                        className="font-serif text-2xl text-amber-900/90 mt-2" 
                        delayOffset={3}
                    />
                </div>

                <SecretVoiceNote />
            </motion.div>
        </section>
    );
}
