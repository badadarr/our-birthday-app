"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const MOCK_MEMORIES = [
  {
    id: 1,
    text: "Nge Date Day 1",
    date: "30 January, 2024",
    rotate: -2,
    note: "Lagi pedekatean duluu ye",
    isFunny: true,
    photo: "/photo/photo-1.jpeg",
  },
  {
    id: 2,
    text: "Nobi Bareng Euy",
    date: "11 February, 2024",
    rotate: 3,
    note: "Padahal baru kenal tapi udah pede banget ngajak nobi",
    isFunny: true,
    photo: "/photo/photo-2.jpeg",
  },
  {
    id: 3,
    text: "Nge Makeup ala Kadar",
    date: "13 March, 2024",
    rotate: -1,
    note: "Walaupun makeupnya belepotan tp tetep bagus",
    isFunny: true,
    photo: "/photo/photo-3.jpeg",
  },
  {
    id: 4,
    text: "Berenang Di Jababeka Golf",
    date: "14 May, 2024",
    rotate: 4,
    note: "anjayyy berenang",
    isFunny: false,
    photo: "/photo/photo-4.jpeg",
  },
  {
    id: 5,
    text: "Muka Ngantuk Level Dewa",
    date: "2 July, 2024",
    rotate: -3,
    note: "abis konser capek bet gokil..",
    isFunny: true,
    photo: "/photo/photo-5.jpeg",
  },
  {
    id: 6,
    text: "Hiking Curug Kesampean Juga",
    date: "1 August, 2024",
    rotate: 2,
    note: "Capee, pegell, encok, mana masih muda wkwk",
    isFunny: false,
    photo: "/photo/photo-6.jpeg",
  },
  {
    id: 7,
    text: "Makan Somtam First Time",
    date: "12 April, 2025",
    rotate: -4,
    note: "Pertama kali nyobain somtam .. pedes nya gokil abes",
    isFunny: true,
    photo: "/photo/photo-7.jpeg",
  },
  {
    id: 8,
    text: "Main Kerumah Nenek-Kakek Badar",
    date: "12 May, 2025",
    rotate: 1,
    note: "Siapa ya yang ultahh lupaa..",
    isFunny: false,
    photo: "/photo/photo-8.jpeg",
  },
  {
    id: 9,
    text: "Lulus Sidang YEEEE",
    date: "27 August, 2025",
    rotate: -2,
    note: "ga nyangka si aas lulus juga..",
    isFunny: false,
    photo: "/photo/photo-9.jpeg",
  },
  {
    id: 10,
    text: "MAIN KE TSM GES",
    date: "23 December, 2025",
    rotate: -2,
    note: "ngakak parah sii.. ",
    isFunny: true,
    photo: "/photo/photo-10.jpeg",
  },
  {
    id: 11,
    text: "M BLOC SPACE PHOTOBOOTH",
    date: "10 January, 2026",
    rotate: 5,
    note: "Akhirnya photobooth juga..",
    isFunny: false,
    photo: "/photo/photo-11.jpeg",
  },
  {
    id: 12,
    text: "PHOTO PASUTRI KAISAR JEPUN",
    date: "20 January, 2026",
    rotate: -2,
    note: "Siapp mencetak sejarah masa depan nih wkwk",
    isFunny: false,
    photo: "/photo/photo-12.jpeg",
  },
  {
    id: 13,
    text: "Makan SS Pertama Kali",
    date: "13 March, 2026",
    rotate: 2,
    note: "Momen aas kecanduan SS.",
    isFunny: false,
    photo: "/photo/photo-13.jpeg",
  },
  {
    id: 14,
    text: "AAS PULANG KAMPUNG :(",
    date: "15 March, 2026",
    rotate: -2,
    note: "SEDIHH MESTI LDR DLU!",
    isFunny: false,
    photo: "/photo/photo-14.jpeg",
  },
];

function PolaroidCard({
  memory,
  index,
}: {
  memory: (typeof MOCK_MEMORIES)[0];
  index: number;
}) {
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
        stiffness: 100,
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
          className={`bg-white p-3 md:p-4 rounded-sm flex flex-col items-center transition-all duration-300 [backface-visibility:hidden] ${
            memory.isFunny
              ? "shadow-[0_10px_30px_rgba(236,72,153,0.1)] hover:shadow-[0_20px_40px_rgba(236,72,153,0.25)] border border-pink-100/50"
              : "shadow-[0_10px_30px_rgba(120,53,15,0.08)] hover:shadow-[0_20px_40px_rgba(120,53,15,0.12)] border border-transparent"
          }`}
        >
          <div
            className={`w-full aspect-[4/5] rounded border overflow-hidden mb-4 relative ${
              memory.isFunny ? "border-pink-900/10" : "border-amber-900/10"
            }`}
          >
            <Image
              src={memory.photo}
              alt={memory.text}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />

            {memory.isFunny && (
              <div className="absolute top-3 right-3 text-2xl rotate-12 drop-shadow-sm z-10">
                😂
              </div>
            )}
          </div>

          <div className="flex items-center justify-center text-center px-2 min-h-[3rem]">
            <p
              className={`font-serif text-base md:text-lg italic leading-tight ${
                memory.isFunny ? "text-pink-900/80" : "text-amber-900/80"
              }`}
            >
              {memory.text}
            </p>
          </div>
        </div>

        {/* Back of Polaroid */}
        <div
          className={`absolute inset-0 p-6 rounded-sm flex flex-col justify-center items-center text-center [backface-visibility:hidden] ${
            memory.isFunny
              ? "bg-[#fff5f8] shadow-[0_10px_30px_rgba(236,72,153,0.1)] border border-pink-100/50"
              : "bg-[#fdfaf3] shadow-[0_10px_30px_rgba(120,53,15,0.08)] border border-transparent"
          }`}
          style={{ transform: "rotateY(180deg)" }}
        >
          {/* Paper Texture Overlay */}
          <div className="absolute inset-0 bg-noise opacity-[0.05] mix-blend-overlay pointer-events-none" />
          <div
            className={`absolute inset-0 pointer-events-none ${
              memory.isFunny ? "bg-pink-900/[0.02]" : "bg-amber-900/[0.02]"
            }`}
          />

          <p
            className={`font-handwriting text-2xl md:text-3xl leading-relaxed mb-4 -rotate-2 ${
              memory.isFunny ? "text-pink-900/90" : "text-amber-900/90"
            }`}
          >
            &ldquo;{memory.note}&rdquo;
          </p>

          <p
            className={`font-serif text-xs uppercase tracking-widest absolute bottom-6 ${
              memory.isFunny ? "text-pink-900/50" : "text-amber-900/50"
            }`}
          >
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
