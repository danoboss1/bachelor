import React from "react";
import { Pressable, Text, View } from "react-native";
import { Icon } from "@/components/ui/Icon";
import { Color } from "@/constants/TWPalette";
import { styles } from "@/assets/styles/statsDetail.styles";

type StatsDetailHeaderProps = {
    title: string;
    subtitle: string;
    onBack: () => void;
};

export function StatsDetailHeader({
    title,
    subtitle,
    onBack,
}: StatsDetailHeaderProps) {
    return (
        <View style={styles.header}>
            <View>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.subtitle}>{subtitle}</Text>
            </View>

            <Pressable
                onPress={onBack}
                style={styles.backBtn}
                hitSlop={16}
            >
                {/* <Icon symbol={"chevron.backward"} size="sm" color={Color.gray[700]} /> */}
                <Text style={{ fontSize: 30, color: "black", fontWeight: "400" }}>
                    ‹
                </Text>
            </Pressable>
        </View>
    )
}
