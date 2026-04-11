import { DiscInHand, Hand, StackWithDiscs } from "@/components/tol/ToLComponents";
import React from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
    M: { id: 1, size: width * 0.28, color: "#004aad" },
    Z: { id: 2, size: width * 0.28, color: "#00bf63" },
    Č: { id: 3, size: width * 0.28, color: "#ff3131" },
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
        currentTask,
        totalTasks,
        onStackPress,
        exitTest,
    } = useTOLGame();

    return (
        <View style={localStyles.container}>
            <View style={localStyles.header}>
                <Text style={localStyles.targetAttemptsText}>
                    Move limit: {targetMoves}
                </Text>
                <Text style={localStyles.userAttemptsText}>
                    Moves used: {userMoves}
                </Text>

                <TouchableOpacity
                    style={localStyles.exitButtonContainer}
                    activeOpacity={0.7}
                    onPress={exitTest}
                >

                    <Text style={localStyles.exitButtonText}>
                        Exit Test
                    </Text>
                </TouchableOpacity>
            </View>

            {/* TARGET */}
            <View style={localStyles.targetPegs}>
                <View style={localStyles.stacksRow}>
                    {targetStacks.map((targetStack, index) => (
                        <StackWithDiscs
                            key={index}
                            stackHeight={[height * 0.24, height * 0.16, height * 0.08][index]}
                            backgroundColor="#e8eef5"
                            discs={targetStack}
                        />
                    ))}
                </View>

                <Text style={localStyles.sectionLabel}>TARGET</Text>
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
                {/* <Text style={localStyles.sectionLabel}>YOUR BOARD</Text> */}
                
                <View style={localStyles.stacksRow}>
                    {stacks.map((stack, index) => (
                        <StackWithDiscs
                            key={index}
                            stackHeight={[height * 0.24, height * 0.16, height * 0.08][index]}
                            backgroundColor="#e8eef5"
                            discs={stack}
                            onPress={() => onStackPress(index)}
                        />
                    ))}
                </View>

                <View style={localStyles.sectionRow}>
                    <Text style={localStyles.sectionLabel}>YOUR BOARD</Text>

                    <Text style={localStyles.progressText}>
                        {currentTask}/{totalTasks}
                    </Text>
                </View>
                {/* <Text style={localStyles.hintText}>Tap a peg to move a disc</Text> */}
            </View>

            {/* DISK V RUKE */}
            {discInHand && (
                <DiscInHand
                    size={discInHand.size}
                    color={discInHand.color}
                />
            )}

            <View style={localStyles.footer}>
                <Text style={localStyles.hintText}>Tap a peg to move a disc</Text>
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
    header: {
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: height * 0.03, 
        paddingBottom: 8,
        paddingHorizontal: 8,
    },
    targetAttemptsText: {
        fontSize: 20, 
        color: "black",
        marginLeft: 4,
        fontWeight: "600",
    },
    userAttemptsText: {
        fontSize: 20, 
        color: "black", 
        fontWeight: "600",
    },
    targetPegs: {
        flex: 3,
        backgroundColor: "#d6c7b9",
        justifyContent: "flex-end",
    },
    userPegs: {
        flex: 3,
        backgroundColor: "#bcc0dd",
        justifyContent: "flex-end",
    },
    footer: {
        flex: 1,
    },
    stacksRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "space-around",
        paddingBottom: height * 0.01,
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
    },
    sectionLabel: {
        textAlign: "center",
        fontSize: 16,
        fontWeight: "700",
        letterSpacing: 1.5,
        marginBottom: 8,
        color: "#333",
    },
    sectionRow: {
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        position: "relative", 
    },
    progressText: {
        position: "absolute",
        right: 10,
        fontSize: 16,
        fontWeight: "700",
        letterSpacing: 1.5,
        marginBottom: 8,
        color: "#333",
    },
    hintText: {
        textAlign: "center",
        fontSize: 13,
        color: "#555",
        marginTop: 4,
        opacity: 0.8,
    },
    exitButtonContainer: {
        paddingVertical: height * 0.012,
        paddingHorizontal: width * 0.04,
        borderRadius: 8,
        backgroundColor: "#A5A5A5",
    },
    exitButtonText: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "500",
    },
});