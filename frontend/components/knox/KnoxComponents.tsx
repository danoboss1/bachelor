import React from "react";
import { Dimensions, Pressable, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

type SquareProps = {
    id: number;
    active?: boolean;
    onPress?: (id: number) => void;
};

export function Square({ id, active = false, onPress }: SquareProps) {
    return (
        <Pressable
            onPress={() => onPress?.(id)}
            style={[
                styles.square,
                active && styles.squareActive,
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
    squareActive: {
        backgroundColor: "#F0B000", // tvoja zlatá
    },
})