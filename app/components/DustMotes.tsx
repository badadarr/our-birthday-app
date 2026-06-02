'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const NUM_PARTICLES = 40;

interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
}

export default function DustMotes() {
    const [particles, setParticles] = useState<Particle[]>([]);

    useEffect(() => {
        const generatedParticles = Array.from({ length: NUM_PARTICLES }).map((_, i) => ({
            id: i,
            x: Math.random() * 100, // percentage
            y: Math.random() * 100, // percentage
            size: Math.random() * 4 + 1, // 1 to 5px
            duration: Math.random() * 10 + 10, // 10s to 20s
            delay: Math.random() * 5,
        }));
        setParticles(generatedParticles);
    }, []);

    if (particles.length === 0) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden mix-blend-screen">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    initial={{ opacity: 0, x: `${p.x}vw`, y: `${p.y}vh` }}
                    animate={{
                        opacity: [0, 0.4, 0],
                        y: [`${p.y}vh`, `${p.y - 10}vh`],
                        x: [`${p.x}vw`, `${p.x + (Math.random() > 0.5 ? 2 : -2)}vw`],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: 'easeInOut',
                    }}
                    className="absolute rounded-full bg-yellow-100 blur-[1px]"
                    style={{
                        width: p.size,
                        height: p.size,
                        boxShadow: '0 0 4px rgba(254, 240, 138, 0.5)',
                    }}
                />
            ))}
        </div>
    );
}
