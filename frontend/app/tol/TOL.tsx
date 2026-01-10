import { DiscInHand, Hand, StackWithDiscs } from "@/components/tol/ToLComponents";
import React, { useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { useTOLGame } from "../hooks/useTOLGame";

const { width, height } = Dimensions.get("window");

type DiscData = {
    id: number;
    size: number;
    color: string;
};

const STACK_CAPACITY = [3, 2, 1];

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

    const [targetStacks, setTargetStacks] = useState<DiscData[][]>([
        [
            { id: 1, size: width * 0.28, color: "yellow" },
            { id: 6, size: width * 0.28, color: "green" },
            { id: 4, size: width * 0.28, color: "red" }, 
        ],
        [
            { id: 4, size: width * 0.28, color: "blue" },
        ],
        [
        ],
    ]);

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

    const [stacks, setStacks] = useState<DiscData[][]>([
        [
            { id: 1, size: width * 0.28, color: "yellow" },
        ],
        [
            { id: 4, size: width * 0.28, color: "#ff3131" },
            { id: 5, size: width * 0.28, color: "#004aad" },
        ],
        [
            { id: 6, size: width * 0.28, color: "#00bf63" },    
        ],
    ]);

    const [showSuccessOverlay, setShowSuccessOverlay] = useState(true);
    const [discInHand, setDiscInHand] = useState<DiscData | null>(null);

    const onStackPress = (stackIndex: number) => {
        setStacks(prev => {
            const newStacks = prev.map(s => [...s]);

            // console.log("newStacks", newStacks);

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

            newStacks[stackIndex].push(discInHand);
            setDiscInHand(null);
            return newStacks;
        });
    };


    // const handRef = React.useRef<View>(null);
  
    return (
        // #f9f9f9
        <View style={localStyles.container}>

            <View style={localStyles.timer}>
                <Text style={localStyles.targetAttemptsText}>Target Moves: 4</Text>
                <Text style={localStyles.userAttemptsText}>Used Moves: 2</Text>
            </View>

            {/* TARGET */}
            <View style={localStyles.targetPegs}>
                <View style={localStyles.stacksRow}>
                    {targetStacks.map((targetStack, index) => (
                        <StackWithDiscs
                            key={index}
                            stackHeight={[height * 0.27, height * 0.18, height * 0.09][index]}
                            backgroundColor="#4CAF50"
                            discs={targetStack}
                        />
                    ))}
                </View>
            </View>

            <View ref={handRef} style={{ flex: 2, justifyContent: "center", alignItems: "center" }}>
                <Hand size={150} color="#E0B899" secondaryColor="#C89B7B" />
                <Text style={[localStyles.feedbackCorrectText, {position: "absolute"}]}>Correct</Text>
            </View>

            {/* USER */}
            <View style={localStyles.userPegs}>
                <View style={localStyles.stacksRow}>
                    {stacks.map((stack, index) => (
                        <StackWithDiscs
                            key={index}
                            stackHeight={[height * 0.27, height * 0.18, height * 0.09][index]}
                            backgroundColor="#FFCC80"
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
    },
    timer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
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
        justifyContent: "flex-end",
    },
    userPegs: {
        flex: 3,
        backgroundColor: "orange",
        justifyContent: "flex-end",
    },
    footer: {
        flex: 1,
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
        color: "green", 
        fontWeight: "bold",
        textAlign: "center",
    },
});

// {showSuccessOverlay && (
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