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
}


export function useKNOXGame() {
    const router = useRouter();

    const threeRef = React.useRef(0);
    const fourRef = React.useRef(0);
    const fiveRef = React.useRef(0);
    const sixRef = React.useRef(0);
    const sevenRef = React.useRef(0);
    const eightRef = React.useRef(0);
    const totalCorrectRef = React.useRef(0);

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

    const [sequenceLengths] = React.useState([
        // testovacie sekvencie
        3, 3, 3,
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

    // tieto koeficienty budem neskor ratat cez nejaku metriku ako je Rasch model
    const COEFFICIENTS = {
        3: 0.1,
        4: 0.15,
        5: 0.2,
        6: 0.3,
        7: 0.5,
        8: 1.2,
    };

    const [threeStepSequencesCorrect, setThreeStepSequencesCorrect] = React.useState(0);
    const [fourStepSequencesCorrect, setFourStepSequencesCorrect] = React.useState(0);
    const [fiveStepSequencesCorrect, setFiveStepSequencesCorrect] = React.useState(0);
    const [sixStepSequencesCorrect, setSixStepSequencesCorrect] = React.useState(0);
    const [sevenStepSequencesCorrect, setSevenStepSequencesCorrect] = React.useState(0);
    const [eightStepSequencesCorrect, setEightStepSequencesCorrect] = React.useState(0);

    const [totalCorrect, setTotalCorrect] = React.useState(0);

    const timeoutRef = React.useRef<number | null>(null);

    const [isAnimating, setIsAnimating] = React.useState(true);
    const [userAnswered, setUserAnswered] = React.useState(false);

    const userAnsweredResolve = React.useRef<() => void | null>(null);

    const [isLastSequence, setIsLastSequence] = React.useState(false);

    // const [totalScore, setTotalScore] = React.useState(0);

    const [finished, setFinished] = React.useState(false);
    
    async function saveKnoxStatstoBackend(score: number) {
        const payload: KnoxStatsPayload = {
            time: new Date().toISOString(),
            threeStepSequencesCorrect: threeStepSequencesCorrect,
            fourStepSequencesCorrect: fourStepSequencesCorrect,
            fiveStepSequencesCorrect: fiveStepSequencesCorrect,
            sixStepSequencesCorrect: sixStepSequencesCorrect,
            sevenStepSequencesCorrect: sevenStepSequencesCorrect,
            eightStepSequencesCorrect: eightStepSequencesCorrect,
            totalCorrect: totalCorrect,
            totalScore: score,
            user_id: 1,
        };

        try {
            await axios.post("https://bachelor-pi.vercel.app/knoxStats", payload);
        } catch (err: any) {
            console.error("Error saving stats:", err);
        }
    }

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
            // vycistenie odpovede pred zlych vyberom
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

        // lebo este tam nie je pridany ten posledny, tak musim zvysit o jedna
        if (userSequenceRef.current.length + 1 === sequence.length) {
            // vycistenie odpovede pred spravnym uhadnutim sekvencie
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

            console.log("3-step Sequence rigth after: ", threeStepSequencesCorrect);
            console.log("total correct right after: ", totalCorrect);

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

        console.log("IMMEDIATE:", userSequenceRef.current);

        timeoutRef.current = setTimeout(() => {
            setActiveUserTap(null);
            timeoutRef.current = null;
        }, 600);
    }

    function generateSequence(length: number) {
        const seq = Array.from({ length }, () =>
            Math.floor(Math.random() * 4)
        );
        setSequence(seq);
        setUserSequence([]);
        console.log("Seq: ", seq);
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

    function delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    async function startGame() {
        // reset flagu na začiatku každej hry
        setIsLastSequence(false);

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

        // const finalScore = 
        //     threeStepSequencesCorrect * COEFFICIENTS[3] +
        //     fourStepSequencesCorrect * COEFFICIENTS[4] +
        //     fiveStepSequencesCorrect * COEFFICIENTS[5] +
        //     sixStepSequencesCorrect * COEFFICIENTS[6] + 
        //     sevenStepSequencesCorrect * COEFFICIENTS[7] +
        //     eightStepSequencesCorrect * COEFFICIENTS[8];
        
        // setTotalScore(finalScore);


        setFinished(true);
    }

    function waitForUser() {
        return new Promise<void>(resolve => {
            userAnsweredResolve.current = resolve;
        });
    }

    // React.useEffect(() => {
    //     if (finished) {
    //         saveStatsToBackend().then(() => {
    //             router.push(WCST_ROUTE_ENDSCREEN); // bez params
    //         });
    //     }
    // }, [finished]);
    React.useEffect(() => {
        if (finished) {
            const finalScore =
                threeRef.current * COEFFICIENTS[3] +
                fourRef.current * COEFFICIENTS[4] +
                fiveRef.current * COEFFICIENTS[5] +
                sixRef.current * COEFFICIENTS[6] +
                sevenRef.current * COEFFICIENTS[7] +
                eightRef.current * COEFFICIENTS[8];
            
            // setTotalScore(finalScore);
            console.log("final score", finalScore);
            // console.log("total score", totalScore);

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

    React.useEffect(() => {
        console.log("3-step Sequence updated:", threeStepSequencesCorrect);
    }, [threeStepSequencesCorrect]);

    React.useEffect(() => {
        console.log("total correct updated:", totalCorrect);
    }, [totalCorrect]);

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