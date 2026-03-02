import { UISize } from "@/types/ui";
import React from "react";
import {
    Platform,
    StyleSheet,
    type StyleProp,
    type TextStyle,
    type ViewStyle,
} from "react-native";

import { SFSymbol, SymbolView } from "expo-symbols";
import { Ionicons } from "@expo/vector-icons";

interface IconProps {
    symbol: SFSymbol;
    size?: UISize | number;
    color?: string;
    style?: StyleProp<ViewStyle | TextStyle>;
    type?: "monochrome" | "hierarchical" | "palette" | "multicolor";
}

const sizeMap: Record<UISize, number> = {
    xs: 14,
    sm: 18,
    md: 22,
    lg: 26,
    xl: 30,
    "2xl": 34,
};

const sfToIon: Record<string, keyof typeof Ionicons.glyphMap> = {
    "chevron.backward": "chevron-back",
    "chevron.forward": "chevron-forward",
};

export const Icon: React.FC<IconProps> = ({
    symbol,
    size = "md",
    color,
    style,
    type = "hierarchical",
}) => {
    const iconSize = typeof size === "string" ? sizeMap[size] : size;

    if (Platform.OS !== "ios") {
        const name = sfToIon[String(symbol)] ?? "help-circle-outline";
        return (
            <Ionicons
                name={name}
                size={iconSize}
                color={color}
                style={style as StyleProp<TextStyle>}
            />
        );
    }

    return (
        <SymbolView
            name={symbol}
            style={[styles.symbol, { width: iconSize, height: iconSize }, style as any]}
            tintColor={color}
            type={type}
            resizeMode="scaleAspectFit"
        />
    );
};

const styles = StyleSheet.create({
    symbol: {
        width: 24,
        height: 24,
    },
});