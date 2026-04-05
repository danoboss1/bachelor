import axios from "axios";
import { useRouter, useFocusEffect } from "expo-router";
import React from "react";
import { Animated, View, Alert, BackHandler, AppState, AppStateStatus } from "react-native";
import { getToken } from "@/app/(auth)/tokenStorage";

const WCST_ROUTE_ENDSCREEN = "/wcst/WCST_endscreen";


const colors = ["red", "green", "orange", "blue"] as const;
const shapes = ["triangle", "star", "plus", "circle"] as const;
const counts = [1, 2, 3, 4] as const;

export type Color = typeof colors[number];
export type Shape = typeof shapes[number];
export type Count = typeof counts[number];

export type Card = {
    id: string;
    color: Color;
    shape: Shape;
    count: Count;
};

type StatsPayload = {
    time: string;
    categories_completed: number;
    trials_administered: number;
    total_correct: number;
    total_error: number;
    perseverative_responses: number;
    perseverative_errors: number;
    non_perseverative_errors: number;
    failure_to_maintain_set: number;
    trials_to_first_category: number | null;
    perseverativepercent: number;
    perseverativeerrorpercent: number;
    nonperseverativeerrorpercent: number;
    errorpercent: number;
};

const TEST_DURATION_SEC = 1200;
const TEST_DURATION_MS = TEST_DURATION_SEC * 1000;

function generateCardPack(): Card[] {
    const copies = 2;
    const cards: Card[] = [];
    for (const color of colors) {
        for (const shape of shapes) {
            for (const count of counts) {
                for (let i = 0; i < copies; i++) {
                    cards.push({ id: `${color}-${shape}-${count}-${i}`, color, shape, count });
                }
            }
        }
    }
    return cards.sort(() => Math.random() - 0.5);
}

export const PILES = {
    redTriangle: { color: "red" as Color, shape: "triangle" as Shape, count: 1 as Count },
    greenStars: { color: "green" as Color, shape: "star" as Shape, count: 2 as Count },
    yellowPluses: { color: "orange" as Color, shape: "plus" as Shape, count: 3 as Count },
    blueCircles: { color: "blue" as Color, shape: "circle" as Shape, count: 4 as Count },
} as const;

export type Rule = "color" | "shape" | "count";
const RULES: Rule[] = ["color", "shape", "count"];


export function useWCSTGame() {
    const router = useRouter();
    
    const startTimeRef = React.useRef<number>(Date.now());
    const endTimeRef = React.useRef<number>(
        startTimeRef.current + TEST_DURATION_MS
    );

    const [timeLeft, setTimeLeft] = React.useState(TEST_DURATION_SEC);

    const [isLocked, setIsLocked] = React.useState(false);
    const [isAnimating, setIsAnimating] = React.useState(false);

    const [cardPack, setCardPack] = React.useState(() => generateCardPack());
    const [movingCard, setMovingCard] = React.useState<Card | null>(null);
    const animPos = React.useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

    const redTriangleRef = React.useRef<View>(null);
    const greenStarsRef = React.useRef<View>(null);
    const yellowPlusesRef = React.useRef<View>(null);
    const blueCirclesRef = React.useRef<View>(null);
    const packRef = React.useRef<View>(null);

    const [rule, setRule] = React.useState<Rule>(() => RULES[Math.floor(Math.random() * RULES.length)]);
    const ruleRef = React.useRef(rule);
    ruleRef.current = rule;

    const [consecutiveCorrect, setConsecutiveCorrect] = React.useState(0);
    const consecutiveRef = React.useRef(consecutiveCorrect);
    consecutiveRef.current = consecutiveCorrect;

    const [categoriesCompleted, setCategoriesCompleted] = React.useState(0);
    const completedRef = React.useRef(categoriesCompleted);
    completedRef.current = categoriesCompleted;

    const [trialsAdministered, setTrialsAdministered] = React.useState(0);

    const [totalCorrect, setTotalCorrect] = React.useState(0);
    const [totalError, settotalError] = React.useState(0);

    const [perseverativeResponses, setPerseverativeResponses] = React.useState(0);
    const previousRuleRef = React.useRef<Rule | null>(null);

    const [perseverativeErrors, setPerseverativeErrors] = React.useState(0);
    const [nonPerseverativeErrors, setNonPerseverativeErrors] = React.useState(0);

    const [failureToMaintainSet, setFailureToMaintainSet] = React.useState(0);
    const [trialsToFirstCategory, setTrialsToFirstCategory] = React.useState<number | null>(null);

    const [feedback, setFeedback] = React.useState<"" | "correct" | "wrong" | "finished">("");
    const feedbackTimeoutRef = React.useRef<number | null>(null);

    const [testFinishedMessage, setTestFinishedMessage] = React.useState(false);
    const [finished, setFinished] = React.useState(false);
    
    const showFeedback = (type: "" | "correct" | "wrong" | "finished") => {
        if (feedbackTimeoutRef.current) {
            clearTimeout(feedbackTimeoutRef.current);
            feedbackTimeoutRef.current = null;
        }

        setFeedback(type);

        if (type !== "") {
            feedbackTimeoutRef.current = setTimeout(() => {
                setFeedback("");
                feedbackTimeoutRef.current = null;
            }, 1000);
        }
    };

    React.useEffect(() => {
        const updateTimer = () => {
            const now = Date.now();
            const remainingMs = endTimeRef.current - now;
            
            if (remainingMs <= 0) {
                setTimeLeft(0);
                setIsLocked(true);
                setTestFinishedMessage(true);
                
                setTimeout(() => {
                    setFinished(true);
                }, 1000);
                
                return;
            }
            setTimeLeft(Math.ceil(remainingMs / 1000));
        };
        
        updateTimer();
        const interval = setInterval(updateTimer, 250);
        return () => clearInterval(interval);
    }, []);
    
    function formatTime(sec: number) {
        const m = Math.floor(sec / 60).toString().padStart(2, "0");
        const s = (sec % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    }
    
    // toto zmenit neskor na 6
    const endTestIfNeeded = React.useCallback((newCategoriesCompleted: number, newAttemptsUsed: number) => {
        if (newCategoriesCompleted >= 1 || newAttemptsUsed >= 128) {
            setIsLocked(true);
            
            // zobraz finished message
            setTestFinishedMessage(true);

            // delay pred endscreen
            setTimeout(() => {
                setFinished(true);
            }, 1000);
            // setFinished(true);
            return true;
        }
        return false;
    }, []);
    
    function pickNewRule(excludeRule: Rule): Rule {
        const options = RULES.filter(r => r !== excludeRule);
        return options[Math.floor(Math.random() * options.length)];
    }
    
    async function saveStatsToBackend() {
        const token = await getToken();

        if (!token) {
            console.error("No JWT token found");
            return;
        }

        const payload: StatsPayload = {
            time: new Date().toISOString(),
            categories_completed: categoriesCompleted,
            trials_administered: trialsAdministered,
            total_correct: totalCorrect,
            total_error: totalError,
            perseverative_responses: perseverativeResponses,
            perseverative_errors: perseverativeErrors,
            non_perseverative_errors: nonPerseverativeErrors,
            failure_to_maintain_set: failureToMaintainSet,
            trials_to_first_category: trialsToFirstCategory,
            perseverativepercent: trialsAdministered > 0 ? Number(((perseverativeResponses / trialsAdministered) * 100).toFixed(2)) : 0,
            perseverativeerrorpercent: trialsAdministered > 0 ? Number(((perseverativeErrors / trialsAdministered) * 100).toFixed(2)) : 0,
            nonperseverativeerrorpercent: trialsAdministered > 0 ? Number(((nonPerseverativeErrors / trialsAdministered) * 100).toFixed(2)) : 0,
            errorpercent: trialsAdministered > 0 ? Number(((totalError / trialsAdministered) * 100).toFixed(2)) : 0,
        };
        
        try {
            await axios.post("https://bachelor-pi.vercel.app/wcstStats", payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (err: any) {
            console.error("Error saving stats:", err);
        }
    }
    
    const moveCardTo = (targetRef: React.RefObject<View | null>, pileKey: keyof typeof PILES) => {
        if (cardPack.length === 0 || isAnimating || isLocked) return;
        
        if (feedbackTimeoutRef.current) {
            clearTimeout(feedbackTimeoutRef.current);
            feedbackTimeoutRef.current = null;
            setFeedback("");
        }

        setIsAnimating(true);
        const card = cardPack[0];
        setMovingCard(card);
        setCardPack(prev => prev.slice(1));
        
        packRef.current?.measure((fx, fy, w, h, px, py) => {
            animPos.setValue({ x: px, y: py });
            
            targetRef.current?.measure((fx2, fy2, w2, h2, tx, ty) => {
                Animated.timing(animPos, {
                    toValue: { x: tx, y: ty },
                    duration: 400,
                    useNativeDriver: false,
                }).start(() => {
                    const pileProps = PILES[pileKey];
                    const currentRule = ruleRef.current;
                    
                    let isCorrect = false;
                    if (currentRule === "color") isCorrect = card.color === pileProps.color;
                    else if (currentRule === "shape") isCorrect = card.shape === pileProps.shape;
                    else if (currentRule === "count") isCorrect = card.count === pileProps.count;
                    
                    const prevRule = previousRuleRef.current;
                    if (prevRule && prevRule !== currentRule) {
                        if (
                            (prevRule === "color" && card.color === PILES[pileKey].color) ||
                            (prevRule === "shape" && card.shape === PILES[pileKey].shape) ||
                            (prevRule === "count" && card.count === PILES[pileKey].count)
                        ) {
                            setPerseverativeResponses(prev => prev + 1);
                        }
                    }
                    
                    setTrialsAdministered(prev => {
                        const next = prev + 1;
                        endTestIfNeeded(completedRef.current, next);
                        return next;
                    });

                    if (consecutiveRef.current >= 2 && !isCorrect) {
                        setFailureToMaintainSet(prev => prev + 1);
                    }

                    if (isCorrect) {
                        setTotalCorrect(prev => prev + 1);
                        const newConsec = consecutiveRef.current + 1;
                        setConsecutiveCorrect(newConsec);
                        showFeedback("correct");
                        
                        if (newConsec >= 10) {
                            const newCompleted = completedRef.current + 1;
                            setCategoriesCompleted(newCompleted);
                            setConsecutiveCorrect(0);
                            // showFeedback("category");
                            
                            previousRuleRef.current = currentRule;
                            
                            const newRule = pickNewRule(currentRule);
                            setRule(newRule);
                            
                            if (newCompleted === 1) setTrialsToFirstCategory(trialsAdministered + 1);
                            
                            endTestIfNeeded(newCompleted, trialsAdministered + 1);
                        }
                    } else {
                        settotalError(prev => prev + 1);
                        setConsecutiveCorrect(0);
                        showFeedback("wrong");
                        
                        let isPerseverativeError = false;
                        if (prevRule && prevRule !== currentRule) {
                            if (
                                (prevRule === "color" && card.color === pileProps.color) ||
                                (prevRule === "shape" && card.shape === pileProps.shape) ||
                                (prevRule === "count" && card.count === pileProps.count)
                            ) isPerseverativeError = true;
                        }
                        
                        if (isPerseverativeError) setPerseverativeErrors(prev => prev + 1);
                        else setNonPerseverativeErrors(prev => prev + 1);
                    }

                    setMovingCard(null);
                    setIsAnimating(false);
                });
            });
        });
    };

    React.useEffect(() => {
        if (finished) {
            saveStatsToBackend().then(() => {
                router.push({
                    pathname: WCST_ROUTE_ENDSCREEN,
                    params: {
                        trialsAdministered,
                        totalCorrect,
                        totalError,
                        perseverativeResponses,
                        perseverativeErrors,
                        nonPerseverativeErrors,
                        categoriesCompleted,
                        failureToMaintainSet,
                        trialsToFirstCategory,
                        perseverativePercent: trialsAdministered > 0 ? Number(((perseverativeResponses / trialsAdministered) * 100).toFixed(2)) : 0,
                        perseverativeErrorPercent: trialsAdministered > 0 ? Number(((perseverativeErrors / trialsAdministered) * 100).toFixed(2)) : 0,
                        nonPerseverativeErrorPercent: trialsAdministered > 0 ? Number(((nonPerseverativeErrors / trialsAdministered) * 100).toFixed(2)) : 0,
                        errorPercent: trialsAdministered > 0 ? Number(((totalError / trialsAdministered) * 100).toFixed(2)) : 0,
                    }
                });
            });
        }
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

    React.useEffect(() => {
        const handleAppStateChange = (nextAppState: AppStateStatus) => {
            if (nextAppState === "background" || nextAppState === "inactive") {
                setIsLocked(true);
            } else if (nextAppState === "active") {
                setIsLocked(false);
            }
        };

        const subscription = AppState.addEventListener("change", handleAppStateChange);
        return () => {
            subscription.remove()
        };
    }, []);

    const currentCard = cardPack[0];

    return {
        timeLeft,
        formatTime,
        redTriangleRef,
        greenStarsRef,
        yellowPlusesRef,
        blueCirclesRef,
        packRef,

        moveCardTo,
        animPos,

        cardPack,
        movingCard,
        isLocked,
        isAnimating,

        feedback,
        testFinishedMessage,
        currentCard,

        exitTest,
    };
}
