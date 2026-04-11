import React from "react";
import { Dimensions, Pressable, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

type SquareProps = {
    id: number;
    activeTargetSequence?: boolean;
    activeUserTap?: boolean;
    incorrectUserTap?: boolean;
    correctLastUserTap?: boolean;
    onPress?: (id: number) => void;
};

export function Square({ id, activeTargetSequence = false, activeUserTap = false, incorrectUserTap = false, correctLastUserTap = false, onPress }: SquareProps) {
    return (
        <Pressable
            onPress={() => onPress?.(id)}
            style={[
                styles.square,
                activeTargetSequence && styles.squareTargetSequenceActive,
                activeUserTap && styles.squareUserTapActive,
                incorrectUserTap && styles.squareIncorrectUserTap,
                correctLastUserTap && styles.squareCorrectLastUserTap,
            ]}
        />
    );
}

const styles = StyleSheet.create({
    square: {
        width: width * 0.28,
        height: width * 0.28,
        backgroundColor: "#718190",
        borderRadius: width * 0.045,
    },
    squareTargetSequenceActive: {
        backgroundColor: "#F0B000", // golden
    },
    squareUserTapActive: {
        backgroundColor: "#00BFFF",
    },
    squareIncorrectUserTap: {
        backgroundColor: "#FF4500",
    },
    squareCorrectLastUserTap: {
        backgroundColor: "#32CD32",
    }
})