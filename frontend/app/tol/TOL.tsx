import { DiscInHand, Hand, StackWithDiscs } from "@/components/tol/ToLComponents";
import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { useTOLGame } from "../hooks/useTOLGAME";

const { width, height } = Dimensions.get("window");

const TOL_ROUTE_ENDSCREEN = "/tol/TOL_endscreen";

type TolStatsPayload = {
    time: string,
    fourMovesSequencesCorrect: number,
    fiveMovesSequencesCorrect: number,
    sixMovesSequencesCorrect: number,
    totalCorrect: number,
    totalScore: number,
    user_id: number,
};

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

const COEFFICIENTS = {
    4: 0.3,
    5: 0.6,
    6: 1.0,
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
        handRef,
        stacks,
        targetStacks,
        discInHand,
        userMoves,
        targetMoves,
        feedback,
        showFeedback,
        finished,
        onStackPress,
    } = useTOLGame();

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
                            // backgroundColor="#4CAF50"
                            // backgroundColor="#f9f9f9"
                            // backgroundColor="#FFCC80"
                            backgroundColor="#e8eef5"
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
                            // backgroundColor="#FFCC80"
                            // backgroundColor="#f9f9f9"
                            backgroundColor="#e8eef5"
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
        // backgroundColor: "green",
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
        // backgroundColor: "#bcc0dd",
        backgroundColor: "#d6c7b9",

        // backgroundColor: "green",
        // backgroundColor: "#5B5FE9",
        // backgroundColor: "#f9f9f9",
        // backgroundColor: "#d6c7b9",
        // orange
        justifyContent: "flex-end",
    },
    userPegs: {
        flex: 3,
        // backgroundColor: "#d6c7b9",
        backgroundColor: "#bcc0dd",

        // backgroundColor: "orange",
        // backgroundColor: "#bcc0dd",
        // backgroundColor: "#2b2f77",
        // backgroundColor: "#f9f9f9",
        justifyContent: "flex-end",
    },
    footer: {
        flex: 1,
        // backgroundColor: "orange",
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