import React from "react";

// export type TapStatus = "correct" | "incorrect" | null;

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
    >("Tap here when you are ready");

    const [activeSquare, setActiveSquare] = React.useState<number | null>(null);
    const [activeUserTap, setActiveUserTap] = React.useState<number | null>(null);
    // const [tapStatus, setTapStatus] = React.useState<TapStatus>(null);
    const [incorrectUserTap, setIncorrectUserTap] = React.useState<number | null>(null);
    const [correctLastUserTap, setCorrectLastUserTap] = React.useState<number | null>(null);

    const [sequence, setSequence] = React.useState<number[]>([]);
    const [userSequence, setUserSequence] = React.useState<number[]>([]);
    const userSequenceRef = React.useRef<number[]>([]);

    const timeoutRef = React.useRef<number | null>(null);

    const [isAnimating, setIsAnimating] = React.useState(true);
    const [userAnswered, setUserAnswered] = React.useState(false);

    // toto tiez lepsie pochopit
    const userAnsweredResolve = React.useRef<() => void | null>(null);
    
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

        // const nextIndex = userSequenceRef.current.length;
        // const isLastTap = nextIndex === sequence.length - 1;
        // const isCorrect = id === sequence[nextIndex];

        const indexNext = userSequenceRef.current.length;

        if (id !== sequence[indexNext]) {
            setFeedback("Incorrect");
            setIncorrectUserTap(id);
            setIsAnimating(true);
            setUserAnswered(true);

            setTimeout(() => {
                setIncorrectUserTap(null);
                timeoutRef.current = null;
            }, 600);

            // co znamena toto?
            userAnsweredResolve.current?.();
            return;
        }

        // lebo este tam nie je pridany ten posledny, tak musim zvysit o jedna
        if (userSequenceRef.current.length + 1 === sequence.length) {
            setFeedback("Well done");
            setCorrectLastUserTap(id);
            setIsAnimating(true);
            setUserAnswered(true);

            setTimeout(() => {
                setCorrectLastUserTap(null);
                timeoutRef.current = null;
            }, 600);

            // co znamena toto?
            userAnsweredResolve.current?.();
            return;
        }

        setActiveUserTap(id);

        if (userSequenceRef.current.length < 5) {
            userSequenceRef.current = [...userSequenceRef.current, id];
            setUserSequence(userSequenceRef.current);
        }

        console.log("IMMEDIATE:", userSequenceRef.current);

        timeoutRef.current = setTimeout(() => {
            setActiveUserTap(null);
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
        // setTapStatus(null);

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

    async function startGame() {
        for(let i = 0; i < 4; i++) {
            setUserAnswered(false);
            setUserSequence([]);
            userSequenceRef.current = [];

            setFeedback("Watch carefully and remember the sequence");

            await delay(300);

            const seq = generateSequence();
            await playSequence(seq);

            setFeedback("Repeat the sequence by tapping the cubes");

            await waitForUser();
            await delay(1000);
        }
    }

    // preco sa uklada resolve do toho Refu?
    function waitForUser() {
        return new Promise<void>(resolve => {
            userAnsweredResolve.current = resolve;
        });
    }

    return {
        timeLeft,
        formatTime,

        feedback,

        activeSquare,
        activeUserTap,
        incorrectUserTap,
        correctLastUserTap,
        lightUpSquare,

        startGame,
    };
}