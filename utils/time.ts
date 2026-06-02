// utils/time.ts
export const getTargetTime = () => {
    // Allows testing the 00:00:00 transition without waiting
    if (process.env.NEXT_PUBLIC_MOCK_TARGET_TIME) {
        return process.env.NEXT_PUBLIC_MOCK_TARGET_TIME;
    }
    // 14 Juni 2026 00:00:00 WIB === 13 Juni 2026 17:00:00 UTC
    return '2026-06-13T17:00:00Z';
};

export const getTargetTimeMs = () => {
    return new Date(getTargetTime()).getTime();
};
