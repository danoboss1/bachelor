import axios from "axios";
import { useRouter } from "expo-router";
import React from "react";

const KNOX_ROUTE_ENDSCREEN = "/knox/KNOX_endscreen";

type KnoxStatsPayload = {
    time: string;
    threeStepSequencesCorrect: number,
    fourStepSequencesCorrect: number,
    fiveStepSequencesCorrect: number,
    sixStepSequencesCorrect: number,
    sevenStepSequencesCorrect: number,
    eightStepSequencesCorrect: number,
    totalCorrect: number,
    totalScore: number,
    user_id: number,
};

const COEFFICIENTS: Record<number, number> = {
    3: 0.1,
    4: 0.15,
    5: 0.2,
    6: 0.3,
    7: 0.5,
    8: 1.2,
};


export function useKNOXGame() {
    const router = useRouter();

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
    const [incorrectUserTap, setIncorrectUserTap] = React.useState<number | null>(null);
    const [correctLastUserTap, setCorrectLastUserTap] = React.useState<number | null>(null);

    const [sequence, setSequence] = React.useState<number[]>([]);
    const [userSequence, setUserSequence] = React.useState<number[]>([]);
    const userSequenceRef = React.useRef<number[]>([]);

    const [isAnimating, setIsAnimating] = React.useState(true);
    const [userAnswered, setUserAnswered] = React.useState(false);
    const [isLastSequence, setIsLastSequence] = React.useState(false);
    const [finished, setFinished] = React.useState(false);

    const threeRef = React.useRef(0);
    const fourRef = React.useRef(0);
    const fiveRef = React.useRef(0);
    const sixRef = React.useRef(0);
    const sevenRef = React.useRef(0);
    const eightRef = React.useRef(0);
    const totalCorrectRef = React.useRef(0);

    const [threeStepSequencesCorrect, setThreeStepSequencesCorrect] = React.useState(0);
    const [fourStepSequencesCorrect, setFourStepSequencesCorrect] = React.useState(0);
    const [fiveStepSequencesCorrect, setFiveStepSequencesCorrect] = React.useState(0);
    const [sixStepSequencesCorrect, setSixStepSequencesCorrect] = React.useState(0);
    const [sevenStepSequencesCorrect, setSevenStepSequencesCorrect] = React.useState(0);
    const [eightStepSequencesCorrect, setEightStepSequencesCorrect] = React.useState(0);
    const [totalCorrect, setTotalCorrect] = React.useState(0);

    const timeoutRef = React.useRef<number | null>(null);
    const userAnsweredResolve = React.useRef<() => void | null>(null);

    const [sequenceLengths] = React.useState([
        // testovacie sekvencie
        3, 4, 5, 6, 7, 8
        // 4,
        // 5,

        // skutocne sekvencie
        // 3, 3,
        // 4, 4, 4, 4,
        // 5, 5, 5, 5,
        // 6, 6, 6,
        // 7, 7, 7,
        // 8, 8,
    ]);


    function delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    function formatTime(sec: number) {
        const m = Math.floor(sec / 60).toString().padStart(2, "0");
        const s = (sec % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    }

    function generateSequence(length: number) {
        const seq = Array.from({ length }, () =>
            Math.floor(Math.random() * 4)
        );
        setSequence(seq);
        setUserSequence([]);
        return seq;
    }

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

    function waitForUser() {
        return new Promise<void>(resolve => {
            userAnsweredResolve.current = resolve;
        });
    }

    async function saveKnoxStatstoBackend(finalScore: number) {
        const payload: KnoxStatsPayload = {
            time: new Date().toISOString(),
            threeStepSequencesCorrect: threeStepSequencesCorrect,
            fourStepSequencesCorrect: fourStepSequencesCorrect,
            fiveStepSequencesCorrect: fiveStepSequencesCorrect,
            sixStepSequencesCorrect: sixStepSequencesCorrect,
            sevenStepSequencesCorrect: sevenStepSequencesCorrect,
            eightStepSequencesCorrect: eightStepSequencesCorrect,
            totalCorrect: totalCorrect,
            totalScore: finalScore,
            user_id: 1,
        };

        try {
            await axios.post("https://bachelor-pi.vercel.app/knoxStats", payload);
        } catch (err: any) {
            console.error("Error saving stats:", err);
        }
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


    function lightUpSquare(id : number) {
        if (isAnimating) return;

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        const indexNext = userSequenceRef.current.length;

        if (id !== sequence[indexNext]) {
            setActiveUserTap(null);

            if (isLastSequence) {
                setFeedback("Incorrect. You have completed the test");
            } else {
                setFeedback("Incorrect");
            }

            setIncorrectUserTap(id);
            setIsAnimating(true);
            setUserAnswered(true);

            setTimeout(() => {
                setIncorrectUserTap(null);
                timeoutRef.current = null;
            }, 1000);

            userAnsweredResolve.current?.();
            return;
        }

        if (userSequenceRef.current.length + 1 === sequence.length) {
            setActiveUserTap(null);

            if (sequence.length === 3) {
                threeRef.current++;
                setThreeStepSequencesCorrect(prev => prev + 1);
            }
            else if (sequence.length === 4) {
                fourRef.current++;
                setFourStepSequencesCorrect(prev => prev + 1);
            }
            else if (sequence.length === 5) {
                fiveRef.current++;
                setFiveStepSequencesCorrect(prev => prev + 1);
            }
            else if (sequence.length === 6) {
                sixRef.current++;
                setSixStepSequencesCorrect(prev => prev + 1);
            }
            else if (sequence.length === 7) {
                sevenRef.current++;
                setSevenStepSequencesCorrect(prev => prev + 1);
            }
            else if (sequence.length === 8) {
                eightRef.current++;
                setEightStepSequencesCorrect(prev => prev + 1);
            }

            totalCorrectRef.current++;
            setTotalCorrect(prev => prev + 1);

            if (isLastSequence) {
                setFeedback("Well done. You have completed the test");
            } else {
                setFeedback("Well done");
            }

            setCorrectLastUserTap(id);
            setIsAnimating(true);
            setUserAnswered(true);

            setTimeout(() => {
                setCorrectLastUserTap(null);
                timeoutRef.current = null;
            }, 1000);

            userAnsweredResolve.current?.();
            return;
        }

        setActiveUserTap(id);

        if (userSequenceRef.current.length < sequence.length) {
            userSequenceRef.current = [...userSequenceRef.current, id];
            setUserSequence(userSequenceRef.current);
        }

        // tento console log neskor vymazat
        // console.log("IMMEDIATE:", userSequenceRef.current);

        timeoutRef.current = setTimeout(() => {
            setActiveUserTap(null);
            timeoutRef.current = null;
        }, 600);
    }

    function resetGame() {
        // refs
        threeRef.current = 0;
        fourRef.current = 0;
        fiveRef.current = 0;
        sixRef.current = 0;
        sevenRef.current = 0;
        eightRef.current = 0;
        totalCorrectRef.current = 0;

        // state
        setThreeStepSequencesCorrect(0);
        setFourStepSequencesCorrect(0);
        setFiveStepSequencesCorrect(0);
        setSixStepSequencesCorrect(0);
        setSevenStepSequencesCorrect(0);
        setEightStepSequencesCorrect(0);
        setTotalCorrect(0);

        setFinished(false);
        setIsLastSequence(false);
        setTimeLeft(60);
        setFeedback("Tap here when you are ready");

        setSequence([]);
        setUserSequence([]);
        userSequenceRef.current = [];

        setActiveSquare(null);
        setActiveUserTap(null);
        setIncorrectUserTap(null);
        setCorrectLastUserTap(null);
    }

    async function startGame() {
        resetGame();

        for(let i = 0; i < sequenceLengths.length; i++) {
            if (i + 1 === sequenceLengths.length) {
                setIsLastSequence(true);
            }

            setUserAnswered(false);
            setUserSequence([]);
            userSequenceRef.current = [];

            setFeedback("Watch carefully and remember the sequence");

            await delay(300);

            const seq = generateSequence(sequenceLengths[i]);
            await playSequence(seq);

            setFeedback("Repeat the sequence by tapping the cubes");

            await waitForUser();
            await delay(1500);
        }

        setFinished(true);
    }

    React.useEffect(() => {
        if (finished) {
            const finalScore =
                threeRef.current * COEFFICIENTS[3] +
                fourRef.current * COEFFICIENTS[4] +
                fiveRef.current * COEFFICIENTS[5] +
                sixRef.current * COEFFICIENTS[6] +
                sevenRef.current * COEFFICIENTS[7] +
                eightRef.current * COEFFICIENTS[8];

            console.log("final score", finalScore);

            saveKnoxStatstoBackend(finalScore).then(() => {
                router.push({
                    pathname: KNOX_ROUTE_ENDSCREEN,
                    params: {
                        threeStepSequencesCorrect,
                        fourStepSequencesCorrect,
                        fiveStepSequencesCorrect,
                        sixStepSequencesCorrect,
                        sevenStepSequencesCorrect,
                        eightStepSequencesCorrect,
                        totalCorrect,
                        totalScore: finalScore,
                    }
                });
            })
        };
    }, [finished]);

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