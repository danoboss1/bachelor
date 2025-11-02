import React from "react";
import { Dimensions, ImageBackground, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../assets/styles/mainScreens.styles";

const { width, height } = Dimensions.get("window");

type StatItem = {
    label: string;
    value: number;
    max?: number;
}

type StatsComponentProps = {
    title: string;
    stats: StatItem[];
    image?: ImageSourcePropType;
}

export function StatsComponent({ title, stats, image }: StatsComponentProps) {
    return (
        <View style={localStyles.card}>
            {image ? (
                <ImageBackground
                    source={image}
                    style={localStyles.imageBackground}
                    imageStyle={{ borderRadius: 16 }}
                >
                    <Text style={localStyles.cardTitle}>{title}</Text>

                    {stats.map((item, index) => {
                        const percentage = Math.min((item.value / (item.max || 100)) * 100, 100);

                        return (
                            <View key={index} style={localStyles.statContainer}>
                                <Text style={localStyles.statLabel}>{item.label}</Text>
                                <View style={localStyles.statRow}>
                                    <Text style={localStyles.statValue}>{item.value}</Text>
                                    <View style={localStyles.progressBarBackground}>
                                        <View style={[localStyles.progressBarFill, { width: `${percentage}%` }]} />
                                    </View>
                                    <Text style={localStyles.statPercentage}>{Math.round(percentage)}%</Text>
                                </View>
                            </View>
                        );
                    })}
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonTextWhite}> More </Text>
                    </TouchableOpacity>
                </ImageBackground>
            ) : (
                <>
                    <Text style={localStyles.cardTitle}>{title}</Text>

                    {stats.map((item, index) => {
                        const percentage = Math.min((item.value / (item.max || 100)) * 100, 100);

                        return (
                            <View key={index} style={localStyles.statContainer}>
                                <Text style={localStyles.statLabel}>{item.label}</Text>
                                <View style={localStyles.statRow}>
                                    <Text style={localStyles.statValue}>{item.value}</Text>
                                    <View style={localStyles.progressBarBackground}>
                                        <View style={[localStyles.progressBarFill, { width: `${percentage}%` }]} />
                                    </View>
                                    <Text style={localStyles.statPercentage}>{Math.round(percentage)}%</Text>
                                </View>
                            </View>
                        );
                    })}
                    <TouchableOpacity style={styles.button}>
                        <Text style={styles.buttonTextWhite}> More </Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}


const localStyles = StyleSheet.create({
    card: {
        height: height * 0.55,
        width: width * 0.9,
        borderRadius: 16,
        marginBottom: 12,
        overflow: "hidden",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        marginHorizontal: width * 0.05,
        marginVertical: height * 0.03,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "white",
        marginVertical: 10,
        textAlign: "center",
    },
    statContainer: {
        marginBottom: 12,
    },
    statLabel: {
        fontSize: 16,
        fontWeight: "600",
        color: "white",
        marginBottom: 4,
    },
    statRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    statValue: {
        width: 40, // fixná šírka pre hodnotu
        color: "white",
        fontWeight: "600",
    },
    progressBarBackground: {
        flex: 1,
        height: 14,
        borderRadius: 6,
        backgroundColor: "#444",
        marginHorizontal: 8,
        overflow: "hidden",
    },
    progressBarFill: {
        height: "100%",
        backgroundColor: "#4caf50",
    },
    statPercentage: {
        width: 40,
        color: "white",
        fontWeight: "600",
        textAlign: "right",
    },
    imageBackground: {
        // width: "100%",
        // height: 150,
        flex: 1,
        alignContent: "center",
        justifyContent: "center",
        padding: 16,
    },
});
