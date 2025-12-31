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
        | "Well done. You have completed the test"
        | "Incorrect. You have completed the test"
    >("Well done. You have completed the test");

    const [activeSquare, setActiveSquare] = React.useState<number | null>(null);
    const [sequence, setSequence] = React.useState<number[]>([]);
    const [userSequence, setUserSequence] = React.useState<number[]>([]);

    const timeoutRef = React.useRef<number | null>(null);

    const [isAnimating, setIsAnimating] = React.useState(false);
    
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

    // rozsviet stvorec po stlaceni
    function lightUpSquare(id : number) {
        if (isAnimating) return;

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        setActiveSquare(id);

        setUserSequence(prev => {
            if (prev.length < 5) {
                return [...prev, id];
            }
            return prev;
        });

        console.log("User sequence: ", userSequence);

        timeoutRef.current = setTimeout(() => {
            setActiveSquare(null);
            timeoutRef.current = null;
        }, 600);
    }

    // vytvor náhodnú sekvenciu (napr. 5 krokov)
    function generateSequence(length = 5) {
        const seq = Array.from({ length }, () =>
            Math.floor(Math.random() * 4)
        );
        setSequence(seq);
        setUserSequence([]);
        console.log("Seq: ", seq);
        return seq;
    }

    // prehra sekvenciu (rozsvietenie)
    async function playSequence(seq: number []) {
        setIsAnimating(true);

        for (const id of seq) {
            setActiveSquare(id);
            await delay(600);
            setActiveSquare(null);
            await delay(300);
        }

        setIsAnimating(false);
    }

    function delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    React.useEffect(() => {
        const seq = generateSequence();
        playSequence(seq);
    }, []);

    return {
        timeLeft,
        formatTime,

        feedback,

        activeSquare,
        lightUpSquare,
    };
}