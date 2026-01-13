import { DiscInHand, Hand, StackWithDiscs } from "@/components/tol/ToLComponents";
import React, { useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { useTOLGame } from "../hooks/useTOLGame";
import { difficultyFive, difficultyFour, difficultySix } from './TOL_data';

const { width, height } = Dimensions.get("window");

type DiscData = {
    id: number;
    size: number;
    color: string;
};

const STACK_CAPACITY = [3, 2, 1];

/* =========================
   DISC MAP
========================= */

const DISC_MAP: Record<string, DiscData> = {
    M: { id: 1, size: width * 0.28, color: "#004aad" }, // modrý
    Z: { id: 2, size: width * 0.28, color: "#00bf63" }, // zelený
    Č: { id: 3, size: width * 0.28, color: "#ff3131" }, // červený
};

/* =========================
   HELPERS
========================= */

const convertStacks = (rawStacks: string[][]): DiscData[][] => {
    return rawStacks.map(stack =>
        stack.map(symbol => DISC_MAP[symbol])
    );
};

const areStacksEqual = (
    a: DiscData[][],
    b: DiscData[][]
): boolean => {
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) {
        if (a[i].length !== b[i].length) return false;

        for (let j = 0; j < a[i].length; j++) {
            if (a[i][j].id !== b[i][j].id) return false;
        }
    }

    return true;
};

/* =========================
   SCREEN
========================= */

export default function TOL_Screen() {
    const {
        moveDisc,
        selectedDiscId,
        handPosition,
        handRef,
        registerDiscRef,
    } = useTOLGame();

    const userAnsweredResolve = React.useRef<() => void | null>(null);

    const [feedback, setFeedback] = React.useState<
        | "" 
        | "Well done!"
        | "Incorrect!"
        | "Well done. You have completed the test!"
        | "Incorrect. You have completed the test!"
    >("");

    /* 🎲 RANDOM DIFFICULTY */
    const randomDifficulty =
        [difficultyFour, difficultyFive, difficultySix][
            Math.floor(Math.random() * 3)
        ];

    const selectedLevel = randomDifficulty[0];

    console.log("Selected level", selectedLevel);

    /* 🎯 STATE */
    const [stacks, setStacks] = useState<DiscData[][]>(() =>
        convertStacks(selectedLevel.userStack)
    );

    const [targetStacks, setTargetStacks] = useState<DiscData[][]>(() =>
        convertStacks(selectedLevel.targetStack)
    );

    // testovacie targetStacks
    // const [targetStacks, setTargetStacks] = useState<DiscData[][]>([
    //     [
    //         { id: 3, size: width * 0.28, color: "#ff3131" }, 
    //     ],
    //     [
    //         { id: 1, size: width * 0.28, color: "#004aad" },
    //         { id: 2, size: width * 0.28, color: "#00bf63" },
    //     ],
    //     [
    //     ],
    // ]);

    // stacky na testovanie
    // const [stacks, setStacks] = useState<DiscData[][]>([
    //     [
    //         { id: 1, size: width * 0.28, color: "red" },
    //         { id: 2, size: width * 0.28, color: "blue" },
    //         { id: 3, size: width * 0.28, color: "green" },
    //     ],
    //     [
    //         { id: 4, size: width * 0.28, color: "red" },
    //         { id: 5, size: width * 0.28, color: "blue" },
    //     ],
    //     [
    //         { id: 6, size: width * 0.28, color: "red" },    
    //     ],
    // ]);

    // testovacie stacks
    // const [stacks, setStacks] = useState<DiscData[][]>([
    //     [
    //     ],
    //     [
    //         { id: 3, size: width * 0.28, color: "#ff3131" },
    //         { id: 2, size: width * 0.28, color: "#00bf63" }, 
    //     ],
    //     [
    //         { id: 1, size: width * 0.28, color: "#004aad" },   
    //     ],
    // ]);

    const [showFeedback, setShowFeedback] = useState(false);

    const [userMoves, setUserMoves] = useState(0); 
    const [targetMoves, setTargetMoves] = useState(selectedLevel.targetMoves);

    const [discInHand, setDiscInHand] = useState<DiscData | null>(null);

    React.useEffect(() => {
        if (feedback) return;

        if (userMoves === targetMoves) {
            setFeedback("Incorrect!");
            setShowFeedback(true);
        }
    }, [userMoves, targetMoves, feedback])

    const onStackPress = (stackIndex: number) => {
        if (showFeedback) return;

        setStacks(prev => {
            const newStacks = prev.map(s => [...s]);

            // console.log("newStacks", newStacks);
            // setTargetMoves(prev => prev + 1);
            
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
            
            // ked davam disk dole, pridat userMoves + 1
            // setUserMoves(prev => prev + 1);

            // newStacks[stackIndex].push(discInHand);
            // setDiscInHand(null);
            
            const nextMove = userMoves + 1;

            newStacks[stackIndex].push(discInHand);
            setDiscInHand(null);
            setUserMoves(nextMove);

            // if(areStacksEqual(newStacks, targetStacks)) {
            //     console.log("Correct");
            //     setFeedback("Well done!");
            //     setShowFeedback(true);
            // }

            const isCorrect = areStacksEqual(newStacks, targetStacks);

            if (isCorrect) {
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

        for(let i = 0; i < 2; i++) {
            setUserMoves(0);
            setDiscInHand(null);
            setFeedback("");
            setShowFeedback(false);

            fourSequenceIndex = Math.floor(Math.random() * 21);

            const selectedLevel = difficultyFour[fourSequenceIndex];
            setStacks(convertStacks(difficultyFour[fourSequenceIndex].userStack))
            setTargetStacks(convertStacks(difficultyFour[fourSequenceIndex].targetStack))

            await waitForUser();
        }
    }

    React.useEffect(() => {
        startGame();
    }, []);


    function waitForUser() {
        return new Promise<void>(resolve => {
            userAnsweredResolve.current = resolve;
        });
    }


    // const randomDifficulty =
    //     [difficultyFour, difficultyFive, difficultySix][
    //         Math.floor(Math.random() * 3)
    //     ];


    // const handRef = React.useRef<View>(null);
  
    return (
        // #f9f9f9
        <View style={localStyles.container}>

            <View style={localStyles.timer}>
                <Text style={localStyles.targetAttemptsText}>Target Moves: {targetMoves}</Text>
                <Text style={localStyles.userAttemptsText}>Used Moves: {userMoves}</Text>
            </View>

            {/* TARGET */}
            <View style={localStyles.targetPegs}>
                <View style={localStyles.stacksRow}>
                    {targetStacks.map((targetStack, index) => (
                        <StackWithDiscs
                            key={index}
                            stackHeight={[height * 0.27, height * 0.18, height * 0.09][index]}
                            backgroundColor="#4CAF50"
                            // backgroundColor="#f9f9f9"
                            // backgroundColor="#FFCC80"
                            discs={targetStack}
                        />
                    ))}
                </View>
            </View>
            
            <View ref={handRef} style={{ flex: 2, justifyContent: "center", alignItems: "center" }}>
                <Hand size={150} color="#E0B899" secondaryColor="#C89B7B" />
                {/* {showFeedback && ( 
                    <Text style={[localStyles.feedbackCorrectText, {position: "absolute"}]}>{feedback}</Text> 
                )} */}
                {feedback === "Well done!" && (
                    <Text style={[localStyles.feedbackCorrectText, {position: "absolute"}]}>{feedback}</Text> 
                )}
                {feedback === "Incorrect!" && (
                    <Text style={[localStyles.feedbackIncorrectText, {position: "absolute"}]}>{feedback}</Text> 
                )}
                {feedback === "Well done. You have completed the test!" && (
                    <Text style={[localStyles.feedbackCorrectText, {position: "absolute"}]}>{feedback}</Text> 
                )}
                {feedback === "Incorrect. You have completed the test!" && (
                    <Text style={[localStyles.feedbackCorrectText, {position: "absolute"}]}>{feedback}</Text> 
                )}
            </View>

            {/* USER */}
            <View style={localStyles.userPegs}>
                <View style={localStyles.stacksRow}>
                    {stacks.map((stack, index) => (
                        <StackWithDiscs
                            key={index}
                            stackHeight={[height * 0.27, height * 0.18, height * 0.09][index]}
                            backgroundColor="#FFCC80"
                            // backgroundColor="#f9f9f9"
                            discs={stack}
                            onPress={() => onStackPress(index)}
                        />
                    ))}
                </View>
            </View>

            {/* DISK V RUKE */}
            {discInHand && (
                <DiscInHand
                    size={discInHand.size}
                    color={discInHand.color}
                />
            )}

            <View style={localStyles.footer}>

            </View>
        </View>
    );
}

/* =========================
   STYLES
========================= */

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        height: "100%",
        backgroundColor: "#f9f9f9",
        // backgroundColor: "orange",
        // backgroundColor: "#706b6b",
    },
    timer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "green",
    },
    targetAttemptsText: {
        fontSize: 20, 
        color: "black",
        marginLeft: 12,
        marginTop: 15, 
        fontWeight: "600",
    },
    userAttemptsText: {
        fontSize: 20, 
        color: "black", 
        marginRight: 12,
        marginTop: 15,
        fontWeight: "600",
    },
    targetPegs: {
        flex: 3,
        backgroundColor: "green",
        // backgroundColor: "#f9f9f9",
        // backgroundColor: "orange",
        justifyContent: "flex-end",
    },
    userPegs: {
        flex: 3,
        backgroundColor: "orange",
        // backgroundColor: "#f9f9f9",
        justifyContent: "flex-end",
    },
    footer: {
        flex: 1,
        backgroundColor: "orange",
    },
    stacksRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-around",
        paddingBottom: height * 0.03,
    },
    peg: {
        width: width * 0.035,
        height: "90%",
        backgroundColor: "#8B5A2B",
        borderRadius: 8,
        marginBottom: 6,
        zIndex: 1,
    },
    feedbackCorrectText: {
        fontSize: 44, 
        color: "#00bf63", 
        fontWeight: "bold",
        textAlign: "center",
    },
    feedbackIncorrectText: {
        fontSize: 44, 
        color: "#ff3131",
        fontWeight: "bold",
        textAlign: "center",
    }
});

// {showFeedback && (
//     <View style={localStyles.overlay}>
//         <Text style={localStyles.overlayText}>Correct</Text>
//     </View>
// )}

// overlay: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     right: 0,
//     bottom: 0,
//     backgroundColor: "rgba(0,0,0,0.45)", // stmavenie
//     justifyContent: "center",
//     alignItems: "center",
//     zIndex: 100,
// },
// overlayText: {
//     fontSize: 48,
//     fontWeight: "800",
//     color: "#4CAF50",
//     backgroundColor: "rgba(255,255,255,0.9)",
//     paddingHorizontal: 24,
//     paddingVertical: 12,
//     borderRadius: 12,
// },