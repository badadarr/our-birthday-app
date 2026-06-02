'use client';

import { motion } from 'framer-motion';

export default function RealWorldBridge() {
    return (
        <section className="relative w-full pb-32 pt-16 flex items-center justify-center z-20">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                transition={{ duration: 2, delay: 5, ease: "easeInOut" }}
                className="flex flex-col items-center text-center space-y-8 px-6"
            >
                <p className="font-serif text-lg md:text-xl text-amber-900/60 italic tracking-wide mb-4">
                    The digital journey ends here, but our real one continues.
                </p>

                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="group relative px-8 py-10 md:px-12 rounded-3xl bg-amber-900 text-amber-50 overflow-hidden shadow-[0_0_30px_rgba(120,53,15,0.2)] hover:shadow-[0_0_50px_rgba(120,53,15,0.4)] transition-all duration-500 max-w-lg mx-auto"
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
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}
