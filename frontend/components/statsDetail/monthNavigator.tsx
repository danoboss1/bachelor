import React from "react";
import { Pressable, Text, View } from "react-native";
import { Icon } from "@/components/ui/Icon";
import { Color } from "@/constants/TWPalette";
import { getMonthName } from "@/components/statsDetail/statsDetailComponents";

type MonthNavigatorProps = {
    month: number;
    year: number;
    onPrev: () => void;
    onNext: () => void;
};

export function MonthNavigator({
    month,
    year,
    onPrev,
    onNext,
}: MonthNavigatorProps) {
    return (
        <View
            style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
                paddingHorizontal: 16,
            }}
        >
            <Pressable
                onPress={onPrev}
                style={{
                    padding: 8,
                    borderRadius: 8,
                }}
                hitSlop={20}
            >
                {/* <Icon
                    symbol={"chevron.backward"}
                    size="sm"
                    color={Color.gray[500]}
                /> */}
                <Text style={{ fontSize: 30, color: "black", fontWeight: "400" }}>
                    ‹
                </Text>
            </Pressable>

            <Text
                style={{
                    fontSize: 18,
                    fontWeight: "600",
                    color: Color.gray[900],
                }}
            >
                {getMonthName(month)} {year}
            </Text>

            <Pressable
                onPress={onNext}
                style={{
                    padding: 8,
                    borderRadius: 8,
                }}
                hitSlop={20}
            >
                {/* <Icon
                    symbol={"chevron.forward"}
                    size="sm"
                    color={Color.gray[500]}
                /> */}
                <Text style={{ fontSize: 30, color: "black", fontWeight: "400" }}>
                    ›
                </Text>
            </Pressable>
        </View>
    );
}