'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Simple Canvas Confetti without external dependencies
function runConfetti() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    type Particle = {
        x: number;
        y: number;
        r: number;
        dx: number;
        dy: number;
        color: string;
        tilt: number;
        tiltAngle: number;
        tiltAngleInc: number;
    };
    const particles: Particle[] = [];
    const colors = ['#fce18a', '#ff726d', '#b48def', '#f4306d', '#3b82f6', '#10b981'];

    for (let i = 0; i < 120; i++) {
        particles.push({
            x: canvas.width / 2,
            y: canvas.height / 2 + 100, // Start slightly below center
            r: Math.random() * 6 + 4,
            dx: Math.random() * 15 - 7.5,
            dy: Math.random() * -15 - 10,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.floor(Math.random() * 10) - 10,
            tiltAngle: 0,
            tiltAngleInc: (Math.random() * 0.07) + 0.05
        });
    }

    function draw() {
        if (!ctx) return;
        requestAnimationFrame(draw);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            ctx.beginPath();
            ctx.lineWidth = p.r;
            ctx.strokeStyle = p.color;
            ctx.moveTo(p.x + p.tilt + p.r, p.y);
            ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
            ctx.stroke();

            p.tiltAngle += p.tiltAngleInc;
            p.y += (Math.cos(p.tiltAngle) + 1 + p.r / 2) / 2;
            p.x += Math.sin(p.tiltAngle) * 2;
            p.tilt = Math.sin(p.tiltAngle) * 15;
        }
    }

    draw();

    setTimeout(() => {
        canvas.style.opacity = '0';
        canvas.style.transition = 'opacity 1s ease-out';
        setTimeout(() => canvas.remove(), 1000);
    }, 4000);
}

export default function RealWorldBridge() {
    const [promoVisible, setPromoVisible] = useState(false);
    const [fleePosition, setFleePosition] = useState({ x: 0, y: 0 });
    const [caughtMessage, setCaughtMessage] = useState(false);

    const handleClaim = () => {
        runConfetti();
        setPromoVisible(true);
    };

    const handleFlee = () => {
        if (caughtMessage) return;
        // Randomly move the button within a range
        const newX = (Math.random() - 0.5) * 200;
        const newY = (Math.random() - 0.5) * 100;
        setFleePosition({ x: newX, y: newY });
    };

    const handleCaught = () => {
        setCaughtMessage(true);
        setFleePosition({ x: 0, y: 0 });
    };

    return (
        <section className="relative w-full pb-32 pt-16 flex items-center justify-center z-20">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                transition={{ duration: 2, delay: 1, ease: "easeInOut" }}
                className="flex flex-col items-center text-center space-y-8 px-6 w-full max-w-2xl"
            >
                <p className="font-serif text-lg md:text-xl text-amber-900/60 italic tracking-wide mb-4">
                    The digital journey ends here, but our real one continues.
                </p>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="group relative px-6 py-10 md:px-12 rounded-3xl bg-amber-900 text-amber-50 overflow-hidden shadow-[0_0_30px_rgba(120,53,15,0.2)] hover:shadow-[0_0_50px_rgba(120,53,15,0.4)] transition-all duration-500 w-full"
                >
                    {/* Glowing effect inside box */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-700 via-amber-800 to-amber-900 opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Pulsing glow behind box */}
                    <motion.div
                        animate={{ opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -inset-2 bg-amber-900/20 rounded-3xl blur-xl -z-10"
                    />

                    <div className="relative z-10 flex flex-col items-center space-y-6">
                        <span className="font-serif text-3xl md:text-4xl text-amber-100 drop-shadow-md">
                            Happy Birthday My sheng!
                        </span>
                        
                        <p className="font-serif text-base md:text-lg text-amber-100/80 italic leading-relaxed">
                            Selamat hari jadi ke 22 yaa. Semoga berkah selalu. Panjang umurnya, diberikan kelancaran rezeki, dan kelancaran dalam proses karir kamu. 🤍
                        </p>

                        {/* Interactive Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-amber-800/50 w-full justify-center items-center relative min-h-[100px]">
                            
                            <motion.button
                                onClick={handleClaim}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 font-bold rounded-xl shadow-[0_0_20px_rgba(251,191,36,0.3)] hover:shadow-[0_0_30px_rgba(251,191,36,0.5)] transition-all w-full sm:w-auto relative z-20"
                            >
                                Klaim Hadiah Dunia Nyata
                            </motion.button>
                            
                            <motion.button
                                onHoverStart={handleFlee}
                                onClick={handleCaught}
                                animate={fleePosition}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className={`px-6 py-3 font-bold rounded-xl border transition-colors shadow-lg w-full sm:w-auto relative z-20 ${
                                    caughtMessage 
                                        ? 'bg-amber-800/50 text-amber-200/50 border-amber-800/50 cursor-not-allowed'
                                        : 'bg-amber-950 text-amber-200/80 border-amber-800/80 hover:bg-amber-900 hover:text-amber-100'
                                }`}
                            >
                                Jangan Diklik
                            </motion.button>

                        </div>

                        {/* Fleeing Button Message */}
                        <AnimatePresence>
                            {caughtMessage && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-sm text-pink-300 italic -mt-2 absolute bottom-2"
                                >
                                    Kamu berhasil! Tapi hadiahnya tetap yang di atas ya 😜
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Promo Code Modal/Toast */}
                <AnimatePresence>
                    {promoVisible && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 20 }}
                            className="mt-6 p-6 bg-white rounded-2xl shadow-2xl border-2 border-amber-300 w-full max-w-sm relative"
                        >
                            <button 
                                onClick={() => setPromoVisible(false)}
                                className="absolute top-2 right-3 text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                            <h3 className="text-gray-800 font-bold mb-2">Yeay! Ini kode kamu:</h3>
                            <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                                <code className="text-2xl font-mono font-bold text-amber-600 tracking-wider">
                                    JATAH-MAKAN-GRATIS
                                </code>
                            </div>
                            <p className="text-xs text-gray-500 mt-3 italic">
                                *Syarat & ketentuan berlaku: Bayar pake doa.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </section>
    );
}
