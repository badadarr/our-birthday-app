// app/teaser/page.tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, useAnimation } from 'framer-motion';
import { Sailboat } from 'lucide-react';
import { useAudio } from '@/app/components/AudioPlayer';
import { useCountdown } from '@/hooks/useCountdown';

const TARGET_TIME_STR = process.env.NEXT_PUBLIC_MOCK_TARGET_TIME || '2026-06-13T17:00:00Z';

// ── Static data (deterministic to prevent hydration errors) ──

// Stars scattered across the sky (upper 60%)
const STARS = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    left: `${(i * 7.3 + 3) % 100}%`,
    top: `${(i * 5.1 + 2) % 55}%`,
    size: i % 5 === 0 ? 3 : i % 3 === 0 ? 2 : 1,
    twinkleDuration: 2 + (i % 4) * 1.5,
    twinkleDelay: (i % 7) * 0.4,
    baseOpacity: 0.3 + (i % 5) * 0.15,
}));

// Slow-drifting ocean reflections (lower half)
const WAVE_LINES = Array.from({ length: 18 }).map((_, i) => ({
    id: i,
    top: `${55 + (i * 2.5)}%`,
    width: `${10 + (i % 5) * 8}vw`,
    duration: 12 + (i % 4) * 5,
    delay: -(i * 1.5),
    opacity: 0.04 + (i % 3) * 0.03,
}));

// Floating particles (bioluminescence in the air)
const PARTICLES = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    left: `${(i * 11.7 + 5) % 100}%`,
    top: `${(i * 8.3 + 15) % 80}%`,
    size: i % 3 === 0 ? 4 : 2,
    floatDuration: 8 + (i % 5) * 3,
    floatDelay: (i % 6) * 1.2,
    driftX: i % 2 === 0 ? 15 : -15,
}));

export default function TeaserPage() {
    const router = useRouter();
    const { triggerFadeIn } = useAudio();
    const waveControls = useAnimation();

    const { timeLeft, isArrived, isClient } = useCountdown(TARGET_TIME_STR);
    const hasTriggeredArrival = useRef(false);
    const [isFadingOut, setIsFadingOut] = useState(false);

    const arrived = isArrived;

    // Start wave drift animation on mount
    useEffect(() => {
        waveControls.start((i) => ({
            x: ['80vw', '-40vw'],
            transition: {
                repeat: Infinity,
                duration: WAVE_LINES[i].duration,
                ease: 'linear',
                delay: WAVE_LINES[i].delay,
            },
        }));
    }, [waveControls]);

    // Arrival trigger
    useEffect(() => {
        if (arrived && !hasTriggeredArrival.current) {
            hasTriggeredArrival.current = true;
            handleArrivalSequence();
        }
    }, [arrived]);

    const handleArrivalSequence = () => {
        waveControls.stop();
        triggerFadeIn();

        setTimeout(() => {
            setIsFadingOut(true);
        }, 4000);

        setTimeout(() => {
            router.push('/');
        }, 6000);
    };

    if (!isClient) return <div className="min-h-screen bg-[#020810]" />;

    return (
        <motion.main
            animate={{ opacity: isFadingOut ? 0 : 1 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
            className="relative min-h-screen bg-[#020810] overflow-hidden flex flex-col items-center justify-center font-sans"
        >
            {/* ═══════════════ ATMOSPHERE LAYERS ═══════════════ */}

            {/* Sky gradient: dark navy at top → deep blue-black at horizon */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#050d1a] via-[#071428] to-[#020810]" />

            {/* Ocean gradient below horizon (bottom 45%) */}
            <div className="absolute bottom-0 left-0 right-0 h-[45%] z-0 bg-gradient-to-b from-transparent via-[#030e1c] to-[#010509]" />

            {/* Horizon line — faint atmospheric glow */}
            <div className="absolute top-[55%] left-0 right-0 h-[2px] z-[1] bg-gradient-to-r from-transparent via-cyan-700/20 to-transparent" />
            <div className="absolute top-[55%] left-0 right-0 h-16 z-[1] bg-gradient-to-b from-cyan-900/5 to-transparent blur-sm" />

            {/* ═══════════════ CRESCENT MOON ═══════════════ */}
            <div className="absolute top-[8%] right-[15%] z-[2] pointer-events-none">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 3 }}
                    className="relative"
                >
                    {/* Moon glow */}
                    <div className="absolute -inset-8 rounded-full bg-cyan-100/5 blur-2xl" />
                    <div className="absolute -inset-4 rounded-full bg-slate-100/5 blur-xl" />
                    {/* Moon body */}
                    <div className="w-8 h-8 rounded-full bg-slate-200/90 shadow-[0_0_30px_rgba(200,220,255,0.3)]" />
                    {/* Crescent shadow */}
                    <div className="absolute top-[1px] left-[6px] w-7 h-7 rounded-full bg-[#050d1a]" />
                </motion.div>
            </div>

            {/* ═══════════════ TWINKLING STARS ═══════════════ */}
            <div className="absolute inset-0 z-[1] pointer-events-none">
                {STARS.map((star) => (
                    <motion.div
                        key={`star-${star.id}`}
                        animate={{ opacity: [star.baseOpacity * 0.3, star.baseOpacity, star.baseOpacity * 0.3] }}
                        transition={{
                            repeat: Infinity,
                            duration: star.twinkleDuration,
                            delay: star.twinkleDelay,
                            ease: 'easeInOut',
                        }}
                        className="absolute rounded-full bg-white"
                        style={{
                            left: star.left,
                            top: star.top,
                            width: star.size,
                            height: star.size,
                            boxShadow: star.size > 2
                                ? '0 0 6px rgba(200,220,255,0.6)'
                                : '0 0 2px rgba(200,220,255,0.3)',
                        }}
                    />
                ))}
            </div>

            {/* ═══════════════ FLOATING PARTICLES (Bioluminescence) ═══════════════ */}
            <div className="absolute inset-0 z-[2] pointer-events-none">
                {PARTICLES.map((p) => (
                    <motion.div
                        key={`particle-${p.id}`}
                        animate={{
                            y: [0, -30, 0],
                            x: [0, p.driftX, 0],
                            opacity: [0, 0.5, 0],
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: p.floatDuration,
                            delay: p.floatDelay,
                            ease: 'easeInOut',
                        }}
                        className="absolute rounded-full bg-cyan-300/60 blur-[1px]"
                        style={{
                            left: p.left,
                            top: p.top,
                            width: p.size,
                            height: p.size,
                            boxShadow: '0 0 8px rgba(103,232,249,0.4)',
                        }}
                    />
                ))}
            </div>

            {/* ═══════════════ OCEAN WAVE LINES ═══════════════ */}
            <div className="absolute inset-0 z-[2] pointer-events-none">
                {WAVE_LINES.map((line, i) => (
                    <motion.div
                        key={`wave-${line.id}`}
                        custom={i}
                        animate={waveControls}
                        className="absolute h-[1px] rounded-full bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent"
                        style={{ top: line.top, width: line.width, opacity: line.opacity }}
                    />
                ))}
            </div>

            {/* Arrival Soft Flash */}
            {arrived && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.2, 0] }}
                    transition={{ duration: 2.5, ease: 'easeOut' }}
                    className="absolute inset-0 z-10 bg-cyan-200 pointer-events-none mix-blend-overlay"
                />
            )}

            {/* Vignette overlay */}
            <div className="absolute inset-0 z-[5] pointer-events-none bg-[radial-gradient(ellipse_at_center,_transparent_10%,_#020810_85%)]" />

            {/* ═══════════════ ROMANTIC TAGLINE (above ticket) ═══════════════ */}
            <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 2, ease: 'easeOut' }}
                className="relative z-20 text-slate-400/70 text-[11px] md:text-xs tracking-[0.25em] uppercase mb-8 text-center"
            >
                Sailing through the night to reach you
            </motion.p>

            {/* ═══════════════ TICKET UI ═══════════════ */}
            <motion.div
                initial={{ y: 40, opacity: 0, scale: 0.97 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{ duration: 1.8, ease: 'easeOut', delay: 0.3 }}
                className="relative z-20 w-[90%] max-w-md"
            >
                {/* Floating + rocking wrapper */}
                <motion.div
                    animate={arrived
                        ? { y: 0, rotateZ: 0 }
                        : { y: [-3, 3, -3], rotateZ: [-0.4, 0.4, -0.4] }
                    }
                    transition={arrived ? {} : { repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                    className="relative bg-white/[0.04] backdrop-blur-lg border border-white/[0.08] p-8 rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.6),_inset_0_1px_0_rgba(255,255,255,0.05)] overflow-hidden"
                >
                    {/* Light sweep */}
                    {!arrived && (
                        <motion.div
                            animate={{ x: ['-150%', '250%'] }}
                            transition={{ repeat: Infinity, duration: 5, delay: 3, ease: 'linear' }}
                            className="absolute top-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent skew-x-[-20deg] z-0"
                        />
                    )}

                    {/* Ticket perforations */}
                    <div className="absolute top-1/2 -left-5 w-10 h-10 bg-[#020810] rounded-full -translate-y-1/2 z-10" />
                    <div className="absolute top-1/2 -right-5 w-10 h-10 bg-[#020810] rounded-full -translate-y-1/2 z-10" />

                    {/* ── Header ── */}
                    <div className="relative z-10 border-b border-dashed border-white/10 pb-6 mb-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="flex items-center justify-center gap-2 mb-5"
                        >
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/10" />
                            <span className="text-slate-500 text-[10px] tracking-[0.35em] uppercase">
                                Voyage Route
                            </span>
                            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10" />
                        </motion.div>

                        <div className="flex justify-between items-center px-2">
                            <motion.div
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 1.2, duration: 0.8 }}
                                className="text-left"
                            >
                                <p className="text-2xl text-slate-200 font-light tracking-wide">13 Jun</p>
                                <p className="text-[10px] text-cyan-400/60 mt-1 tracking-widest uppercase">My Day</p>
                            </motion.div>

                            {/* Ship icon */}
                            <div className="flex-1 px-3 relative flex items-center justify-center">
                                <div className="h-[1px] w-full bg-gradient-to-r from-cyan-800/20 via-cyan-600/30 to-cyan-800/20" />
                                <motion.div
                                    animate={arrived
                                        ? { x: 0, rotateZ: 0 }
                                        : { x: [-8, 8, -8], rotateZ: [-4, 4, -4] }
                                    }
                                    transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                                    className="absolute text-cyan-400 bg-[#020810]/80 px-1.5 drop-shadow-[0_0_8px_rgba(103,232,249,0.5)]"
                                >
                                    <Sailboat className="w-5 h-5" strokeWidth={1.5} />
                                </motion.div>
                            </div>

                            <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 1.4, duration: 0.8 }}
                                className="text-right"
                            >
                                <p className="text-2xl text-slate-200 font-light tracking-wide">14 Jun</p>
                                <p className="text-[10px] text-cyan-400/60 mt-1 tracking-widest uppercase">Your Day</p>
                            </motion.div>
                        </div>
                    </div>

                    {/* ── Countdown ── */}
                    <div className="relative z-10 text-center pt-2">
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.6 }}
                            className="text-slate-500 text-[10px] tracking-[0.25em] uppercase mb-6"
                        >
                            Estimated Arrival
                        </motion.p>

                        <div className="h-24 flex items-center justify-center">
                            {arrived ? (
                                <motion.div
                                    initial={{ scale: 0.5, opacity: 0, filter: 'blur(12px)' }}
                                    animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
                                    transition={{ type: 'spring', stiffness: 180, damping: 12 }}
                                    className="flex flex-col items-center"
                                >
                                    <span className="text-4xl md:text-5xl font-serif text-cyan-300 tracking-[0.2em] drop-shadow-[0_0_20px_rgba(103,232,249,0.3)]">
                                        DOCKED
                                    </span>
                                    <span className="text-[10px] text-cyan-400/50 tracking-[0.3em] uppercase mt-3">
                                        Welcome ashore
                                    </span>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 1.8 }}
                                    className="flex items-center gap-3 text-3xl md:text-4xl text-slate-200 font-light tabular-nums"
                                >
                                    {[
                                        { value: timeLeft?.hours, label: 'Hrs' },
                                        { value: timeLeft?.minutes, label: 'Min' },
                                        { value: timeLeft?.seconds, label: 'Sec' },
                                    ].map((unit, idx) => (
                                        <div key={unit.label} className="flex items-center gap-3">
                                            {idx > 0 && (
                                                <motion.span
                                                    animate={{ opacity: [1, 0.3, 1] }}
                                                    transition={{ repeat: Infinity, duration: 1 }}
                                                    className="text-cyan-600/50"
                                                >
                                                    :
                                                </motion.span>
                                            )}
                                            <div className="flex flex-col items-center">
                                                <span className="bg-white/[0.03] border border-white/[0.06] px-3 py-1.5 rounded-md shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)] min-w-[52px] text-center">
                                                    {String(unit.value ?? 0).padStart(2, '0')}
                                                </span>
                                                <span className="text-[8px] text-slate-600 uppercase tracking-[0.2em] mt-2">{unit.label}</span>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* ═══════════════ ROMANTIC TAGLINE (below ticket) ═══════════════ */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5, duration: 2 }}
                className="relative z-20 text-slate-500/50 text-[10px] tracking-[0.2em] mt-10 text-center italic"
            >
                &ldquo;Every wave brings me closer to you.&rdquo;
            </motion.p>
        </motion.main>
    );
}