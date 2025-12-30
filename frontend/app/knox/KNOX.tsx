import { Square } from "@/components/knox/KnoxComponents";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useKNOXGame } from "../hooks/useKNOXGame";

export default function KNOX_Screen() {
    const {
        timeLeft,
        formatTime,
        feedback,
    } = useKNOXGame();

    return (
        <View style={localStyles.container}> 

            <View style={localStyles.timer}>
                {/* <Text style={styles.timerText}>Timer: {formatTime(timeLeft)}</Text> */}
            </View>

            <View style={localStyles.infoBox}>
                {feedback === "Tap here when you are ready" && (
                    <Text style={localStyles.feedbackStartText}>Tap here{"\n"}when you are ready</Text>
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
                {feedback === "You have completed the test" && (
                    <Text style={localStyles.feedbackTestFinishedText}>You have{"\n"}completed the test!</Text>
                )}
            </View>
            
            <View style={localStyles.squaresBox}>
                <View style={localStyles.squaresRow}>
                    <Square id={1}/>
                    <Square id={2}/>
                </View>
                <View style={localStyles.squaresRow}>
                    <Square id={3}/>
                    <Square id={4}/>
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
    timer: {
        flex: 1,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
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