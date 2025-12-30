import React from "react";

export function useKNOXGame() {
    const [timeLeft, setTimeLeft] = React.useState(60);
    const [feedback, setFeedback] = React.useState<
        | ""
        | "Tap here when you are ready"
        | "Watch carefully and remember the sequence"
        | "Repeat the sequence by tapping the cubes"
        | "Well done"
        | "Incorrect"
        | "You have completed the test"
    >("You have completed the test");

    function formatTime(sec: number) {
        const m = Math.floor(sec / 60).toString().padStart(2, "0");
        const s = (sec % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    }

    React.useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                }
                return prev - 1;
            });
        }, 1000); 

        return () => clearInterval(interval);
    }, []);

    return {
        timeLeft,
        formatTime,

        feedback,
    };
}