import { Square } from "@/components/knox/KnoxComponents";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Dimensions } from "react-native";
import { useKNOXGame } from "../hooks/useKNOXGame";
import { styles } from "@/assets/styles/auth.styles";

const { width, height } = Dimensions.get("window");

// mozno ked stlacim velakrat za sebou rychlo
// jedno tlacitko, tak by to malo
// vzdy na chvilku zhasnut
// aby bolo vidno pre uzivatela, ze
// to stlacil viackrat 

export default function KNOX_Screen() {
    const {
        timeLeft,
        formatTime,
        feedback,
        activeSquare,
        activeUserTap,
        incorrectUserTap,
        correctLastUserTap,
        lightUpSquare,
        startGame,
        exitTest,
    } = useKNOXGame();

    return (
        <View style={localStyles.container}> 

            <View style={localStyles.header}>
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

            <View style={localStyles.infoBox}>
                {feedback === "Tap here when you are ready" && (
                    <Text 
                        style={localStyles.feedbackStartText}
                        onPress={startGame}
                    >
                        Tap here{"\n"}when you are ready
                    </Text>
                )}
                {feedback === "Watch carefully and remember the sequence" && (
                    <Text style={localStyles.feedbackGameText}>Watch carefully and{"\n"}remember the sequence</Text>
                )}
                {feedback === "Repeat the sequence by tapping the cubes" && (
                    <Text style={localStyles.feedbackGameText}>Repeat the sequence{"\n"}by tapping the cubes</Text>
                )}
                {feedback === "Well done" && (
                    <Text style={localStyles.feedbackCorrectText}>Well done!</Text>
                )}
                {feedback === "Incorrect" && (
                    <Text style={localStyles.feedbackIncorrectText}>Incorrect!</Text>
                )}
                {feedback === "Well done. You have completed the test" && (
                    <View>
                        <Text style={localStyles.feedbackCorrectText}>Well done!</Text>
                        <Text style={localStyles.feedbackTestFinishedText}>You have{"\n"}completed the test!</Text>
                    </View>
                )}
                {feedback === "Incorrect. You have completed the test" && (
                    <View>
                        <Text style={localStyles.feedbackIncorrectText}>Incorrect!</Text>
                        <Text style={localStyles.feedbackTestFinishedText}>You have{"\n"}completed the test!</Text>
                    </View>
                )}
                {feedback === "Test ended early based on performance" && (
                    <View>
                        <Text style={localStyles.feedbackTestFinishedText}>
                            Test ended early based on performance!
                        </Text>
                    </View>
                )}
            </View>
            
            <View style={localStyles.squaresBox}>
                <View style={localStyles.squaresRow}>
                    <Square 
                        id={0} 
                        activeTargetSequence={activeSquare === 0} 
                        activeUserTap={activeUserTap === 0}
                        incorrectUserTap={incorrectUserTap === 0}
                        correctLastUserTap={correctLastUserTap === 0}
                        onPress={() => lightUpSquare(0)}
                    />
                    <Square 
                        id={1} 
                        activeTargetSequence={activeSquare === 1} 
                        activeUserTap={activeUserTap === 1}
                        incorrectUserTap={incorrectUserTap === 1}
                        correctLastUserTap={correctLastUserTap === 1}
                        onPress={() => lightUpSquare(1)}
                    />
                </View>
                <View style={localStyles.squaresRow}>
                    <Square 
                        id={2} 
                        activeTargetSequence={activeSquare === 2}
                        activeUserTap={activeUserTap === 2}
                        incorrectUserTap={incorrectUserTap === 2}
                        correctLastUserTap={correctLastUserTap === 2}
                        onPress={() => lightUpSquare(2)}
                    />
                    <Square 
                        id={3} 
                        activeTargetSequence={activeSquare === 3}
                        activeUserTap={activeUserTap === 3}
                        incorrectUserTap={incorrectUserTap === 3}
                        correctLastUserTap={correctLastUserTap === 3}
                        onPress={() => lightUpSquare(3)}
                    />
                </View>
            </View>

            <View style={localStyles.footer} />

        </View>
    );
} 

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#dceeff",
    },
    header: {
        flexDirection: "row",
        // flex: 1,
        width: "100%",
        justifyContent: "flex-end",
        alignItems: "center",
        paddingHorizontal: width * 0.05,
        paddingTop: height * 0.03, 
    },
    exitButtonContainer: {
        paddingVertical: height * 0.012,
        paddingHorizontal: width * 0.04,
        borderRadius: 8,
        backgroundColor: "#7aaeff",
    },
    exitButtonText: {
        fontSize: 16,
        color: "#fff",
        fontWeight: "500",
    },
    infoBox: {
        flex: 2,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    squaresBox: {
        flex: 4,
    },
    footer: {
        flex: 1,
    },
    squaresRow: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
    timerText: {
        fontSize: 24, 
        color: "black" 
    },
    feedbackStartText: { 
        fontSize: 28, 
        color: "#F0B000", 
        fontWeight: "bold",
        textAlign: "center",
    },
    feedbackGameText: { 
        fontSize: 28, 
        color: "#222222", 
        fontWeight: "bold", 
        textAlign: "center", 
    },
    feedbackCorrectText: {
        fontSize: 28, 
        color: "#32CD32", 
        fontWeight: "bold",
        textAlign: "center",
    },
    feedbackIncorrectText: {
        fontSize: 28, 
        color: "#FF4500", 
        fontWeight: "bold",
        textAlign: "center",
    },
    feedbackTestFinishedText: {
        fontSize: 28, 
        color: "#F0B000", 
        fontWeight: "bold",
        textAlign: "center",
    },
})