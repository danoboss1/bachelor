import axios from "axios";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Alert, BackHandler, Dimensions, View } from "react-native";
import { difficultyFive, difficultyFour, difficultySix } from "../tol/TOL_data";
import { getToken } from "@/app/(auth)/tokenStorage";

const { width, height } = Dimensions.get("window");

const TOL_ROUTE_ENDSCREEN = "/tol/TOL_endscreen";

type TolStatsPayload = {
    time: string;
    fourMovesSequencesCorrect: number;
    fiveMovesSequencesCorrect: number;
    sixMovesSequencesCorrect: number;
    totalCorrect: number;
    totalScore: number;
};

type DiscData = {
    id: number;
    size: number;
    color: string;
};

const STACK_CAPACITY = [3, 2, 1];

const DISC_MAP: Record<string, DiscData> = {
    M: { id: 1, size: width * 0.28, color: "#004aad" }, // modrý
    Z: { id: 2, size: width * 0.28, color: "#00bf63" }, // zelený
    Č: { id: 3, size: width * 0.28, color: "#ff3131" }, // červený
};

const COEFFICIENTS = {
    4: 0.15,
    5: 0.325,
    6: 0.375,
};

const convertStacks = (rawStacks: string[][]): DiscData[][] => {
    return rawStacks.map((stack) => stack.map((symbol) => DISC_MAP[symbol]));
};

const areStacksEqual = (a: DiscData[][], b: DiscData[][]): boolean => {
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) {
        if (a[i].length !== b[i].length) return false;

        for (let j = 0; j < a[i].length; j++) {
            if (a[i][j].id !== b[i][j].id) return false;
        }
    }

    return true;
};

function getUniqueRandomIndex(
    max: number,
    usedIndexes: Set<number>
): number {
    if (usedIndexes.size >= max) {
        throw new Error("No more unique indexes available");
    }

    let index: number;
    do {
        index = Math.floor(Math.random() * max);
    } while (usedIndexes.has(index));

    usedIndexes.add(index);
    return index;
}

export function useTOLGame() {
    const router = useRouter();

    const handRef = React.useRef<View>(null);

    const fourRef = useRef(0);
    const fiveRef = useRef(0);
    const sixRef = useRef(0);
    const totalCorrectRef = useRef(0);

    const userAnsweredResolve = React.useRef<() => void | null>(null);

    const [fourMovesSequencesCorrect, setFourMovesSequencesCorrect] = useState(0);
    const [fiveMovesSequencesCorrect, setFiveMovesSequencesCorrect] = useState(0);
    const [sixMovesSequencesCorrect, setSixMovesSequencesCorrect] = useState(0);
    const [totalCorrect, setTotalCorrect] = useState(0);
    
    const [stacks, setStacks] = useState<DiscData[][]>([]);
    const [targetStacks, setTargetStacks] = useState<DiscData[][]>([]);
    const [userMoves, setUserMoves] = useState(0); 
    const [targetMoves, setTargetMoves] = useState(0);
    
    const [discInHand, setDiscInHand] = useState<DiscData | null>(null);

    const [feedback, setFeedback] = React.useState<
    | "" 
    | "Well done!"
    | "Incorrect!"
    | "Well done. You have completed the test!"
    | "Incorrect. You have completed the test!"
    >("");
    
    const [showFeedback, setShowFeedback] = useState(false);
    const [finished, setFinished] = React.useState(false);

    const [currentTask, setCurrentTask] = useState(1);
    const totalTasks = 24;
    
    const usedFourIndexesRef = useRef<Set<number>>(new Set());
    const usedFiveIndexesRef = useRef<Set<number>>(new Set());
    const usedSixIndexesRef = useRef<Set<number>>(new Set());
    
    function delay(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
    
    function waitForUser() {
        return new Promise<void>(resolve => {
            userAnsweredResolve.current = resolve;
        });
    }
    
    async function saveTolStatstoBackend(score: number) {
        const token = await getToken();
        
        if (!token) {
            console.error("No JWT token found");
            return;
        }
        
        const payload: TolStatsPayload = {
            time: new Date().toISOString(),
            fourMovesSequencesCorrect: fourMovesSequencesCorrect,
            fiveMovesSequencesCorrect: fiveMovesSequencesCorrect,
            sixMovesSequencesCorrect: sixMovesSequencesCorrect,
            totalCorrect: totalCorrect,
            totalScore: score,
        }
        
        try {
            await axios.post("https://bachelor-pi.vercel.app/tolStats", payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (err: any) {
            console.error("Error saving stats:", err);
        }
    }
    
    const onStackPress = (stackIndex: number) => {
        if (showFeedback) return;
        
        setStacks(prev => {
            const newStacks = prev.map(s => [...s]);
            
            if (!discInHand) {
                if (newStacks[stackIndex].length === 0) return prev;
                const pickedDisc = newStacks[stackIndex].pop()!;
                setDiscInHand(pickedDisc);
                return newStacks;
            }
            
            const maxCapacity = STACK_CAPACITY[stackIndex];
            
            if (newStacks[stackIndex].length >= maxCapacity) {
                return prev;
            }
            
            // toto mozem pouzit na vizualne zvyraznenie plneho stacku
            // const isFull = discs.length >= STACK_CAPACITY[index];
            
            const nextMove = userMoves + 1;
            
            newStacks[stackIndex].push(discInHand);
            setDiscInHand(null);
            setUserMoves(nextMove);
            
            const isCorrect = areStacksEqual(newStacks, targetStacks);
            
            if (isCorrect) {
                if (targetMoves === 4) {
                    fourRef.current++;
                    setFourMovesSequencesCorrect(prev => prev + 1);
                }
                if (targetMoves === 5) {
                    fiveRef.current++;
                    setFiveMovesSequencesCorrect(prev => prev + 1);
                }
                if (targetMoves === 6) {
                    sixRef.current++;
                    setSixMovesSequencesCorrect(prev => prev + 1);
                }

                totalCorrectRef.current++;
                setTotalCorrect(prev => prev + 1);
                
                setFeedback("Well done!");
                setShowFeedback(true);
                
                userAnsweredResolve.current?.();
                // mam sem dat return;???
            } else if (nextMove === targetMoves) {
                setFeedback("Incorrect!");
                setShowFeedback(true);
                
                userAnsweredResolve.current?.();
                // mam sem dat return;???
            }
            
            return newStacks;
        });
    };
    
    
    let fourSequenceIndex: number;
    let fiveSequenceIndex: number;
    let sixSequenceIndex: number;
    
    async function startGame() {
        usedFourIndexesRef.current.clear();
        usedFiveIndexesRef.current.clear();
        usedSixIndexesRef.current.clear();
        
        // tu som skoncil odtial to pokracujem dalej 
        // s tym aby to tu sekvenciu mohlo zobrat nanajvys raz a nie viac razy
        
        let taskCounter = 1;

        for(let i = 0; i < 8; i++) {
            setCurrentTask(taskCounter);

            const index = getUniqueRandomIndex(
                difficultyFour.length,
                usedFourIndexesRef.current
            );
            const level = difficultyFour[index];
            
            setUserMoves(0);
            setDiscInHand(null);
            setFeedback("");
            setShowFeedback(false);
            
            // fourSequenceIndex = Math.floor(Math.random() * 21);
            
            setStacks(convertStacks(level.userStack))
            setTargetStacks(convertStacks(level.targetStack))
            setTargetMoves(level.targetMoves);
            
            await waitForUser();
            await delay(1500);

            taskCounter++;
        }
        
        for(let i = 0; i < 8; i++) {
            setCurrentTask(taskCounter);

            const index = getUniqueRandomIndex(
                difficultyFive.length,
                usedFiveIndexesRef.current
            );
            const level = difficultyFive[index];
            
            setUserMoves(0);
            setDiscInHand(null);
            setFeedback("");
            setShowFeedback(false);
            
            
            setStacks(convertStacks(level.userStack))
            setTargetStacks(convertStacks(level.targetStack))
            setTargetMoves(level.targetMoves);
            
            await waitForUser();
            await delay(1500);

            taskCounter++;
        }

        // pocet uloh
        for(let i = 0; i < 8; i++) {
            setCurrentTask(taskCounter);

            const index = getUniqueRandomIndex(
                difficultySix.length,
                usedSixIndexesRef.current
            );
            const level = difficultySix[index];
            
            setUserMoves(0);
            setDiscInHand(null);
            setFeedback("");
            setShowFeedback(false);
            
            setStacks(convertStacks(level.userStack))
            setTargetStacks(convertStacks(level.targetStack))
            setTargetMoves(level.targetMoves);
            
            await waitForUser();
            await delay(1500);

            taskCounter++;
        }
        
        // neviem ci treba aj sem return;???
        setFinished(true);
    }

    React.useEffect(() => {
        startGame();
    }, []);

    React.useEffect(() => {
        if (finished) {
            const totalScore = 
                fourRef.current * COEFFICIENTS[4] +
                fiveRef.current * COEFFICIENTS[5] +
                sixRef.current * COEFFICIENTS[6];

            saveTolStatstoBackend(totalScore).then(() => {
                router.replace({
                    pathname: TOL_ROUTE_ENDSCREEN,
                    params: {
                        fourMovesSequencesCorrect,
                        fiveMovesSequencesCorrect,
                        sixMovesSequencesCorrect,
                        totalCorrect,
                        totalScore,
                    }
                });
            })
        };
    }, [finished]);

    const exitTest = React.useCallback(() => {
        Alert.alert(
            "Exit Test",
            "Are you sure you want to exit?\nYour progress will not be saved.",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Exit",
                    style: "destructive",
                    onPress: () => {
                        router.replace("/(tabs)/games");
                    },
                },
            ],
            { cancelable: true }
        );
    }, [router]);
    
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                Alert.alert(
                    "Exit Test",
                    "Are you sure you want to exit?\nYour progress will not be saved.",
                    [
                    {
                        text: "Cancel",
                        style: "cancel",
                    },
                    {
                        text: "Exit",
                        style: "destructive",
                        onPress: () => {
                            router.replace("/(tabs)/games");
                        },
                    },
                    ],
                    { cancelable: true }
                );

                return true;
            };

            const subscription = BackHandler.addEventListener(
                "hardwareBackPress",
                onBackPress
            );

            return () => subscription.remove();
        }, [router])
    );

    return {
        // refs
        handRef,
        
        // game state 
        stacks,
        targetStacks,
        discInHand,
        
        userMoves,
        targetMoves,

        feedback,
        showFeedback,

        finished,

        currentTask,
        totalTasks,

        // handlers
        onStackPress,

        exitTest,
    };

    // tu budem mozno presuvat aj to Start Game 
    // alebo to upravim aj pri inych suboroch, aby to bolo konzistentne vsade
}
