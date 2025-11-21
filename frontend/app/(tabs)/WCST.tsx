import { AllCard, Blue_Circles_Card, Green_Stars_Card, Red_Triangle_Card, Yellow_Pluses_Card } from "@/components/Card";
import { LinearGradient } from 'expo-linear-gradient';
import React from "react";
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const { width, height } = Dimensions.get("window");

// TYPE DEFINITIONS
const colors = ["red", "green", "orange", "blue"] as const;
const shapes = ["triangle", "star", "plus", "circle"] as const;
const counts = [1, 2, 3, 4] as const;
type Color = typeof colors[number];
type Shape = typeof shapes[number];
type Count = typeof counts[number]; 

type Card = {
    id: string;
    color: Color;
    shape: Shape;
    count: Count;
};

// ----- CARD PACK GENERATOR -----
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

// canonical reference cards for piles
const PILES = {
    redTriangle: { color: "red" as Color, shape: "triangle" as Shape, count: 1 as Count },
    greenStars: { color: "green" as Color, shape: "star" as Shape, count: 2 as Count },
    yellowPluses: { color: "orange" as Color, shape: "plus" as Shape, count: 3 as Count },
    blueCircles: { color: "blue" as Color, shape: "circle" as Shape, count: 4 as Count },
} as const;

type Rule = "color" | "shape" | "count";
const RULES: Rule[] = ["color", "shape", "count"];

export default function WCST_Screen() {
    // Timer
    const [timeLeft, setTimeLeft] = React.useState(1200);

    // Card pack
    const [cardPack, setCardPack] = React.useState(() => generateCardPack());
    const [movingCard, setMovingCard] = React.useState<Card | null>(null); // animovaná karta
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

    const [attemptsUsed, setAttemptsUsed] = React.useState(0);

    // tuto odstranim neskor tu category, lebo netusim naco to tam uplne je
    const [feedback, setFeedback] = React.useState<"" | "correct" | "wrong" | "category">("");

    // Feedback zmizne po 1 sekunde
    React.useEffect(() => {
        if (feedback !== "") {
            const timeout = setTimeout(() => setFeedback(""), 1000);
            return () => clearTimeout(timeout);
        }
    }, [feedback]);

    // Timer 20 minút
    React.useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    // nastavuje sa odpoved/feedback na wrong po uplynuti casu
                    setFeedback("wrong");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    function formatTime(sec: number) {
        const m = Math.floor(sec / 60).toString().padStart(2, "0");
        const s = (sec % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    }

    const endTestIfNeeded = React.useCallback((newCategoriesCompleted: number, newAttemptsUsed: number) => {
        if (newCategoriesCompleted >= 6) {
            setFeedback("category");
            return true;
        }
        if (newAttemptsUsed >= 128) {
            setFeedback("wrong");
            return true;
        }
        return false;
    }, []);

    function pickNewRule(excludeRule: Rule): Rule {
        const options = RULES.filter(r => r !== excludeRule);
        return options[Math.floor(Math.random() * options.length)];
    }

    // Funkcia animácie karty
    const moveCardTo = (targetRef: React.RefObject<View | null>, pileKey: keyof typeof PILES) => {
        if (cardPack.length === 0) return;

        const card = cardPack[0];
        setMovingCard(card); // nastav animovanú kartu

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

                    // mozno prepisat, aby to bolo viac citatelne
                    const isCorrect =
                        currentRule === "color"
                            ? card.color === pileProps.color
                            : currentRule === "shape"
                            ? card.shape === pileProps.shape
                            : card.count === pileProps.count;

                    setAttemptsUsed(prev => {
                        const next = prev + 1;
                        endTestIfNeeded(completedRef.current, next);
                        return next;
                    });

                    if (isCorrect) {
                        const newConsec = consecutiveRef.current + 1;
                        setConsecutiveCorrect(newConsec);
                        setFeedback("correct");

                        if (newConsec >= 10) {
                            const newCompleted = completedRef.current + 1;
                            setCategoriesCompleted(newCompleted);
                            setConsecutiveCorrect(0);
                            setFeedback("category");

                            const newRule = pickNewRule(currentRule);
                            setRule(newRule);

                            endTestIfNeeded(newCompleted, attemptsUsed + 1);
                        }
                    } else {
                        setConsecutiveCorrect(0);
                        setFeedback("wrong");
                    }

                    setCardPack(prev => prev.slice(1));
                    setMovingCard(null);
                });
            });
        });
    };

    const currentCard = cardPack[0];

    return (
        <LinearGradient
            colors={["#FF8C00", "#FFD700"]} // žltá → oranžová
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.container}
        >
            {/* <View style={styles.container}> */}
                {/* TIMER */}
            <View style={[styles.timer, { justifyContent: "center", alignItems: "center" }]}>
                <Text style={{ fontSize: 24, color: "black" }}>Timer: {formatTime(timeLeft)}</Text>
            </View>

            {/* HORNÉ PILE */}
            <View style={styles.row}>
                <TouchableOpacity ref={redTriangleRef} activeOpacity={0.8} onPress={() => moveCardTo(redTriangleRef, "redTriangle")}>
                    <Red_Triangle_Card />
                </TouchableOpacity>
                <TouchableOpacity ref={greenStarsRef} activeOpacity={0.8} onPress={() => moveCardTo(greenStarsRef, "greenStars")}>
                    <Green_Stars_Card />
                </TouchableOpacity>
            </View>

            <View style={styles.row}>
                <TouchableOpacity ref={yellowPlusesRef} activeOpacity={0.8} onPress={() => moveCardTo(yellowPlusesRef, "yellowPluses")}>
                    <Yellow_Pluses_Card />
                </TouchableOpacity>
                <TouchableOpacity ref={blueCirclesRef} activeOpacity={0.8} onPress={() => moveCardTo(blueCirclesRef, "blueCircles")}>
                    <Blue_Circles_Card />
                </TouchableOpacity>
            </View>

            {/* FEEDBACK */}
            <View style={[styles.message, { justifyContent: "center", alignItems: "center" }]}>
                {feedback === "correct" && <Text style={{ fontSize: 28, color: "lime", fontWeight: "bold" }}>Correct!</Text>}
                {feedback === "wrong" && <Text style={{ fontSize: 28, color: "red", fontWeight: "bold" }}>Wrong!</Text>}
                {feedback === "category" && <Text style={{ fontSize: 24, color: "yellow", fontWeight: "bold" }}>Category Completed!</Text>}
            </View>

            {/* BOTTOM ROW - CURRENT CARD */}
            <View style={[styles.row, { height: 140, justifyContent: "space-around" }]}>
                <View ref={packRef}>
                    {currentCard && <AllCard color={currentCard.color} shape={currentCard.shape} count={currentCard.count} />}
                </View>

                {/* <View>
                    <Text>Pokusy: {attemptsUsed} / 128</Text>
                    <Text>Konsekutívne spr.: {consecutiveCorrect}</Text>
                    <Text>Dokončené kategórie: {categoriesCompleted}</Text>
                    <Text>Aktuálne pravidlo: {rule.toUpperCase()}</Text>
                </View> */}
            </View>

            {/* ANIMOVANÁ KARTA */}
            {movingCard && (
                <Animated.View style={{ position: "absolute", left: animPos.x, top: animPos.y }}>
                    <AllCard color={movingCard.color} shape={movingCard.shape} count={movingCard.count} />
                </Animated.View>
            )}
            {/* </View> */}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    row: {
        flexDirection: "row",
        width: "100%",
        flex: 3,
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
    },
    message: {
        flex: 1,
        width: "100%",
    },
    timer: {
        flex: 1,
        width: "100%",
    }
});

