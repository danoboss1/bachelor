import { AllCard, Blue_Circles_Card, Green_Stars_Card, Red_Triangle_Card, Yellow_Pluses_Card } from "@/components/cards/AllCard";
import { LinearGradient } from 'expo-linear-gradient';
import React from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useWCSTGame } from "../hooks/useWCSTGame";

export const options = { headerShown: false };

export default function WCST_Screen() {
    const {
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
        currentCard,
        movingCard,
        isLocked,
        isAnimating,
        feedback,
    } = useWCSTGame();

    return (
        <LinearGradient
            colors={["#FF8C00", "#FFD700"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.container}
        >
            <View style={styles.timer}>
                <Text style={styles.timerText}>Timer: {formatTime(timeLeft)}</Text>
            </View>

            <View style={styles.row}>
                <TouchableOpacity
                    ref={redTriangleRef}
                    activeOpacity={0.8}
                    onPress={() => moveCardTo(redTriangleRef, "redTriangle")}
                    disabled={isAnimating || isLocked}
                >
                    <Red_Triangle_Card />
                </TouchableOpacity>

                <TouchableOpacity
                    ref={greenStarsRef}
                    activeOpacity={0.8}
                    onPress={() => moveCardTo(greenStarsRef, "greenStars")}
                    disabled={isAnimating || isLocked}
                >
                    <Green_Stars_Card />
                </TouchableOpacity>
            </View>

            <View style={styles.row}>
                <TouchableOpacity
                    ref={yellowPlusesRef}
                    activeOpacity={0.8}
                    onPress={() => moveCardTo(yellowPlusesRef, "yellowPluses")}
                    disabled={isAnimating || isLocked}
                >
                    <Yellow_Pluses_Card />
                </TouchableOpacity>

                <TouchableOpacity
                    ref={blueCirclesRef}
                    activeOpacity={0.8}
                    onPress={() => moveCardTo(blueCirclesRef, "blueCircles")}
                    disabled={isAnimating || isLocked}
                >
                    <Blue_Circles_Card />
                </TouchableOpacity>
            </View>

            <View style={[styles.message, { justifyContent: "center", alignItems: "center" }]}>
                {feedback === "correct" && (
                    <Text style={styles.feedbackCorrectText}>Correct!</Text>
                )}
                {feedback === "wrong" && (
                    <Text style={styles.feedbackWrongText}>Wrong!</Text>
                )}
                {feedback === "category" && (
                    <Text style={styles.feedbackCategoryText}>Category Completed!</Text>
                )}
            </View>

            <View style={[styles.row, { height: 140, justifyContent: "space-around" }]}>
                <View ref={packRef}>
                    {currentCard && (
                        <AllCard
                            color={currentCard.color}
                            shape={currentCard.shape}
                            count={currentCard.count}
                        />
                    )}
                </View>
            </View>

            {movingCard && (
                <Animated.View style={{ position: "absolute", left: animPos.x, top: animPos.y }}>
                    <AllCard
                        color={movingCard.color}
                        shape={movingCard.shape}
                        count={movingCard.count}
                    />
                </Animated.View>
            )}
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
        justifyContent: "center",
        alignItems: "center",
    },
    timerText: {
        fontSize: 24, 
        color: "black" 
    },
    feedbackCorrectText: { 
        fontSize: 28, 
        color: "lime", 
        fontWeight: "bold", 
    },
    feedbackWrongText: { 
        fontSize: 28, 
        color: "red", 
        fontWeight: "bold", 
    },
    feedbackCategoryText: { 
        fontSize: 24, 
        color: "yellow", 
        fontWeight: "bold",
    },
});