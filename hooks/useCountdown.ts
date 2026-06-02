import { useState, useEffect } from 'react';

export function useCountdown(targetTimeStr: string) {
    const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);
    const [isArrived, setIsArrived] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const targetTime = new Date(targetTimeStr).getTime();

        const interval = setInterval(() => {
            const mockTime = process.env.NEXT_PUBLIC_MOCK_TIME;
            // If mockTime exists, we use it for the initial time calculation, but we need it to tick.
            // Since mockTime is static, it's better to just mock the targetTime or the initial offset.
            // A simpler way: we just let the system time run. If they want to mock, they set the system clock,
            // OR we calculate the offset from mockTime.
            // Let's just use Date.now() and allow them to mock the TARGET_TIME instead for easier testing.
            const now = Date.now();
            const difference = targetTime - now;

            if (difference <= 0) {
                clearInterval(interval);
                setIsArrived(true);
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
            } else {
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);
                setTimeLeft({ hours, minutes, seconds });
            }
        }, 1000);

        // Run once immediately
        const initialDiff = targetTime - Date.now();
        if (initialDiff <= 0) {
            setIsArrived(true);
            setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        }

        return () => clearInterval(interval);
    }, [targetTimeStr]);

    // To prevent hydration mismatch, we don't return the formatted time until the client has mounted
    return { timeLeft: isClient ? timeLeft : null, isArrived: isClient ? isArrived : false, isClient };
}
