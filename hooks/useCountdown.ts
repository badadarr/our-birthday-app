import { useState, useEffect } from 'react';

export function useCountdown(targetTimeStr: string) {
    const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
    const [isArrived, setIsArrived] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const targetTime = new Date(targetTimeStr).getTime();

        const calculate = () => {
            const now = Date.now();
            const difference = targetTime - now;

            if (difference <= 0) {
                setIsArrived(true);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return true; // signal to stop
            } else {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);
                setTimeLeft({ days, hours, minutes, seconds });
                return false;
            }
        };

        // Run once immediately on mount
        const done = calculate();
        if (done) return;

        const interval = setInterval(() => {
            const stopped = calculate();
            if (stopped) clearInterval(interval);
        }, 1000);

        return () => clearInterval(interval);
    }, [targetTimeStr]);

    // To prevent hydration mismatch, we don't return the formatted time until the client has mounted
    return { timeLeft: isClient ? timeLeft : null, isArrived: isClient ? isArrived : false, isClient };
}
