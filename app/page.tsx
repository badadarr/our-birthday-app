import HeroSection from "./components/HeroSection";
import MemoryGallery from "./components/MemoryGallery";
import DigitalLetter from "./components/DigitalLetter";
import DustMotes from "./components/DustMotes";

export default function Home() {
    return (
        <main className="relative min-h-screen bg-gradient-to-b from-[#fffaf0] via-[#fdf5e6] to-[#fff0f5] overflow-hidden selection:bg-amber-200/50 selection:text-amber-900">
            {/* Morning Glow Effect */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-amber-100/40 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-pink-100/40 blur-[100px] pointer-events-none" />
            
            <DustMotes />
            
            <HeroSection />
            <MemoryGallery />
            <DigitalLetter />
            
            <div className="h-32 bg-transparent" /> {/* Spacer */}
        </main>
    );
}
