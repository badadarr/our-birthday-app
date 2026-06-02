// app/teaser/page.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useAnimation } from 'framer-motion';
import { useAudio } from '@/app/components/AudioPlayer'; // Sesuaikan path
import { useCountdown } from '@/hooks/useCountdown';

const TARGET_TIME_STR = process.env.NEXT_PUBLIC_MOCK_TARGET_TIME || '2026-06-13T17:00:00Z';

// Data statis untuk Bokeh agar tidak terjadi Hydration Error
const BOKEH_DATA = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    top: `${5 + (i * 4.5)}%`, // Tersebar vertikal
    size: (i % 3 === 0) ? 14 : (i % 2 === 0) ? 8 : 20,
    duration: 6 + (i % 5) * 1.5, // Variasi kecepatan
    delay: -(i * 2),
    opacity: 0.1 + (i % 4) * 0.1,
}));

// Speed lines untuk efek pergerakan cepat kereta
const SPEED_LINES = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    width: `${Math.random() * 15 + 5}vw`,
    duration: Math.random() * 0.8 + 0.4,
    delay: Math.random() * 1,
    opacity: Math.random() * 0.2 + 0.05,
}));

export default function TeaserPage() {
    const router = useRouter();
    const { triggerFadeIn } = useAudio();
    const bokehControls = useAnimation();
    const speedLineControls = useAnimation();

    const { timeLeft, isArrived, isClient } = useCountdown(TARGET_TIME_STR);
    const [isBypassed, setIsBypassed] = useState(false);
    const hasTriggeredArrival = useRef(false);
    const [isFadingOut, setIsFadingOut] = useState(false);
    
    const arrived = isArrived || isBypassed;

    // Menjalankan animasi bokeh dan speed lines saat pertama kali mount
    useEffect(() => {
        bokehControls.start((i) => ({
            x: ['100vw', '-20vw'],
            transition: {
                repeat: Infinity,
                duration: BOKEH_DATA[i].duration,
                ease: 'linear',
                delay: BOKEH_DATA[i].delay,
            },
        }));

        speedLineControls.start((i) => ({
            x: ['100vw', '-50vw'],
            transition: {
                repeat: Infinity,
                duration: SPEED_LINES[i].duration,
                ease: 'linear',
                delay: SPEED_LINES[i].delay,
            },
        }));
    }, [bokehControls, speedLineControls]);

    // Logika Trigger 00:00
    useEffect(() => {
        if (arrived && !hasTriggeredArrival.current) {
            hasTriggeredArrival.current = true;
            handleArrivalSequence();
        }
    }, [arrived]);

    const handleArrivalSequence = () => {
        // Hentikan laju lampu dan garis (kereta berhenti)
        bokehControls.stop();
        speedLineControls.stop();

        // Trigger lagu membesar volumenya
        triggerFadeIn();

        // Urutan Transisi ke halaman utama
        setTimeout(() => {
            setIsFadingOut(true); // Layar mulai menggelap & tiket memudar
        }, 4000); // Biarkan user menikmati momen 'Arrived' selama 4 detik

        setTimeout(() => {
            router.push('/'); // Pindah ke halaman kejutan utama
        }, 6000);
    };

    // Mencegah render hydration mismatch pada timer
    if (!isClient) return <div className="min-h-screen bg-slate-950" />;

    return (
        <motion.main
            animate={{ opacity: isFadingOut ? 0 : 1 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
            className="relative min-h-screen bg-slate-950 overflow-hidden flex items-center justify-center font-sans perspective-[1000px]"
        >
            {/* Speed Lines Effect */}
            <div className="absolute inset-0 z-0 opacity-50 pointer-events-none">
                {SPEED_LINES.map((line, i) => (
                    <motion.div
                        key={`speed-${line.id}`}
                        custom={i}
                        animate={speedLineControls}
                        className="absolute h-[1px] bg-slate-300"
                        style={{ top: line.top, width: line.width, opacity: line.opacity }}
                    />
                ))}
            </div>

            {/* Background Parallax Bokeh */}
            <div className="absolute inset-0 z-0 opacity-60 pointer-events-none">
                {BOKEH_DATA.map((dot, i) => (
                    <motion.div
                        key={`bokeh-${dot.id}`}
                        custom={i}
                        animate={bokehControls}
                        className="absolute rounded-full bg-yellow-200/80 blur-[2px]"
                        style={{
                            top: dot.top,
                            width: dot.size,
                            height: dot.size,
                            opacity: dot.opacity,
                        }}
                    />
                ))}
            </div>

            {/* Arrival Soft Flash Effect */}
            {arrived && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.15, 0] }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    className="absolute inset-0 z-10 bg-amber-200 pointer-events-none mix-blend-overlay"
                />
            )}

            {/* Dev Only Bypass Button */}
            {process.env.NODE_ENV === 'development' && !arrived && (
                <button 
                    onClick={() => setIsBypassed(true)}
                    className="absolute top-8 right-8 z-50 bg-amber-500/20 hover:bg-amber-500/40 border border-amber-500/50 text-amber-500 text-xs tracking-widest uppercase px-4 py-2 rounded transition-colors"
                >
                    Bypass to 00:00
                </button>
            )}

            {/* Vignette Effect Jendela Kereta */}
            <div className="absolute inset-0 z-10 pointer-events-none bg-[radial-gradient(ellipse_at_center,_transparent_0%,_#020617_100%)]" />

            {/* Ticket UI Container */}
            <motion.div
                initial={{ y: 50, opacity: 0, rotateX: 10 }}
                animate={{ y: 0, opacity: 1, rotateX: 0 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="relative z-20 w-[90%] max-w-md"
            >
                {/* Floating wrapper for the ticket */}
                <motion.div
                    animate={arrived ? { y: 0 } : { y: [-5, 5, -5] }}
                    transition={arrived ? {} : { repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="relative bg-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] overflow-hidden"
                >
                    {/* Light Sweep Reflection Effect */}
                    {!arrived && (
                        <motion.div
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ repeat: Infinity, duration: 3, delay: 2, ease: "linear" }}
                            className="absolute top-0 bottom-0 w-24 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] z-0"
                        />
                    )}

                    {/* Efek Perforasi Tiket */}
                    <div className="absolute top-1/2 -left-6 w-12 h-12 bg-slate-950 rounded-full -translate-y-1/2 shadow-inner z-10" />
                    <div className="absolute top-1/2 -right-6 w-12 h-12 bg-slate-950 rounded-full -translate-y-1/2 shadow-inner z-10" />

                    <div className="relative z-10 border-b-2 border-dashed border-white/20 pb-6 mb-6 text-center">
                        <motion.h2
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                            className="text-slate-400 text-xs tracking-[0.3em] uppercase mb-4"
                        >
                            Transit Route
                        </motion.h2>

                        <div className="flex justify-between items-center px-4">
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 1.2, duration: 0.8 }}
                                className="text-left"
                            >
                                <p className="text-2xl text-slate-200 font-light">13 Jun</p>
                                <p className="text-xs text-slate-500 mt-1">My Day</p>
                            </motion.div>

                            {/* Ikon panah/kereta dengan glow */}
                            <div className="flex-1 px-4 relative flex items-center justify-center">
                                <div className="h-[1px] w-full bg-slate-600" />
                                <motion.div
                                    animate={arrived ? { x: 0 } : { x: [-15, 15, -15] }}
                                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                                    className="absolute text-amber-500/80 text-lg drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]"
                                >
                                    &#10230;
                                </motion.div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 1.4, duration: 0.8 }}
                                className="text-right"
                            >
                                <p className="text-2xl text-slate-200 font-light">14 Jun</p>
                                <p className="text-xs text-slate-500 mt-1">Your Day</p>
                            </motion.div>
                        </div>
                    </div>

                    <div className="relative z-10 text-center pt-2">
                        <motion.p
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }}
                            className="text-slate-400 text-xs tracking-[0.2em] uppercase mb-6"
                        >
                            Estimated Arrival
                        </motion.p>

                        <div className="h-20 flex items-center justify-center">
                            {arrived ? (
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0, filter: "blur(10px)" }}
                                    animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                                    className="text-4xl md:text-5xl font-serif text-amber-400 tracking-widest border-y-2 border-amber-400/30 py-3 px-6 shadow-[0_0_30px_rgba(251,191,36,0.15)] bg-amber-400/5 rounded-lg"
                                >
                                    ARRIVED
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.8 }}
                                    className="flex space-x-4 text-3xl md:text-4xl text-slate-200 font-light tabular-nums"
                                >
                                    <div className="flex flex-col items-center">
                                        <span className="bg-slate-900/50 px-2 py-1 rounded border border-white/5 shadow-inner">
                                            {String(timeLeft?.hours).padStart(2, '0')}
                                        </span>
                                        <span className="text-[9px] text-slate-500 uppercase tracking-widest mt-2">Hrs</span>
                                    </div>
                                    <span className="text-slate-600 mt-2">:</span>
                                    <div className="flex flex-col items-center">
                                        <span className="bg-slate-900/50 px-2 py-1 rounded border border-white/5 shadow-inner">
                                            {String(timeLeft?.minutes).padStart(2, '0')}
                                        </span>
                                        <span className="text-[9px] text-slate-500 uppercase tracking-widest mt-2">Min</span>
                                    </div>
                                    <span className="text-slate-600 mt-2">:</span>
                                    <div className="flex flex-col items-center">
                                        <span className="bg-slate-900/50 px-2 py-1 rounded border border-white/5 shadow-inner">
                                            {String(timeLeft?.seconds).padStart(2, '0')}
                                        </span>
                                        <span className="text-[9px] text-slate-500 uppercase tracking-widest mt-2">Sec</span>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </motion.main>
    );
}