import { router } from "expo-router";
import React from "react";
import { Dimensions, ImageBackground, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../assets/styles/mainScreens.styles";

const { width, height } = Dimensions.get("window");

type StatMiniProps = {
    label: string;
    value: number;
    percentile: number;
    max?: number;
    showPercentSign?: boolean; 
};

export function StatMini({ label, value, percentile, max = 100, showPercentSign }: StatMiniProps) {
    const percentage = Math.min((percentile / max) * 100, 100);

    return (
        <View style={stylesMini.container}>
            {/* 1. Label */}
            <Text style={stylesMini.label}>{label}</Text>

            {/* 2. Hodnota v strede */}
            <Text style={stylesMini.valueCentered}>
                {value}{showPercentSign ? "%" : ""}
            </Text>

            {/* 3. Bar + percentil */}
            <View style={stylesMini.barRow}>
                {/* <Text> percentile </Text> */}
                <View style={stylesMini.barBackground}>
                    <View style={[stylesMini.barFill, { width: `${percentage}%` }]} />
                </View>

                <Text style={stylesMini.barText} numberOfLines={1}>
                    {Math.round(percentage)}% percentile
                </Text>
                {/* <Text style={stylesMini.percent}>{Math.round(percentage)}% percentile</Text> */}
            </View>

            {/* <Text style={stylesMini.percent}>{Math.round(percentage)}% percentile</Text> */}
        </View>
    );
}

type StatMiniSupplementaryProps = {
    label: string;
    value: number | string;
    whole?: number;
};

export function StatMiniSupplementary({ label, value, whole }: StatMiniSupplementaryProps) {
    return (
        <View style={stylesSupplementary.container}>
            <Text style={stylesSupplementary.label}>{label}</Text>
            <Text style={stylesSupplementary.value}>
                {whole !== undefined ? `${value}/${whole}` : value}
            </Text>
        </View>
    );
}

type StatItem = {
    label: string;
    value: number;
    percentile: number;
    max?: number;
    showPercentSign?: boolean;
}

type StatsComponentProps = {
    title: string;
    stats: StatItem[];
    image?: ImageSourcePropType;
    path: "/wcst/WCST_stats_detail" | "/tol/TOL_stats_detail" | "/knox/KNOX_stats_detail";
}

export function StatsComponent({ title, stats, image, path }: StatsComponentProps) {
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
                        // const percentage = Math.min((item.value / (item.max || 100)) * 100, 100);

                        return (
                            <View key={index} style={localStyles.statContainer}>
                                <Text style={stylesMini.label}>{item.label}</Text>

                                <Text style={stylesMini.valueCentered}>
                                    {item.value}{item.showPercentSign ? "%" : ""}
                                </Text>

                                <View style={stylesMini.barRow}>
                                    <View style={stylesMini.barBackground}>
                                        {/* tuto mam v statMini, iny vypocet, potom to checknut, ktore je spravne */}
                                        <View style={[stylesMini.barFill, { width: `${item.percentile}%` }]} />
                                    </View>

                                    <Text style={stylesMini.barText} numberOfLines={1}>
                                        {/* tuto mam v statMini, iny vypocet, potom to checknut, ktore je spravne */}
                                        {Math.round(item.percentile)}% percentile
                                    </Text>
                                </View>
                            </View>
                        );
                    })}

                    <TouchableOpacity 
                        style={styles.button}
                        onPress={() => router.push(path)}
                    >
                        <Text style={styles.buttonTextWhite}> More </Text>
                    </TouchableOpacity>
                </ImageBackground>
            ) : (
                <>
                    <Text style={localStyles.cardTitle}>{title}</Text>

                    {stats.map((item, index) => {
                        // const percentage = Math.min((item.value / (item.max || 100)) * 100, 100);

                        return (
                            <View key={index} style={localStyles.statContainer}>
                                <Text style={stylesMini.label}>{item.label}</Text>

                                <Text style={stylesMini.valueCentered}>
                                    {item.value}{item.showPercentSign ? "%" : ""}
                                </Text>

                                <View style={stylesMini.barRow}>
                                    <View style={stylesMini.barBackground}>
                                        {/* tuto mam v statMini, iny vypocet, potom to checknut, ktore je spravne */}
                                        <View style={[stylesMini.barFill, { width: `${item.percentile}%` }]} />
                                    </View>

                                    <Text style={stylesMini.barText} numberOfLines={1}>
                                        {/* tuto mam v statMini, iny vypocet, potom to checknut, ktore je spravne */}
                                        {Math.round(item.percentile)}% percentile
                                    </Text>
                                </View>
                            </View>
                        );
                    })}

                    <TouchableOpacity 
                        style={styles.button}
                        onPress={() => router.push(path)}
                    >
                        <Text style={styles.buttonTextWhite}> More </Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
}

const localStyles = StyleSheet.create({
    card: {
        width: width * 0.9,
        borderRadius: 16,
        marginBottom: 16,
        marginTop: 20,
        overflow: "hidden",
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        marginHorizontal: width * 0.05,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "black",
        marginVertical: 10,
        textAlign: "center",
    },
    statContainer: {
        marginBottom: 12,
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

const stylesMini = StyleSheet.create({
    container: {
        width: width,
        marginVertical: height * 0.02,
        paddingHorizontal: width * 0.05,
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        color: "black",
        textAlign: "center", // label do stredu
        marginBottom: 4,
    },
    valueCentered: {
        fontSize: 16,
        fontWeight: "700",
        color: "black",
        textAlign: "center", // hodnota do stredu
        marginBottom: 8,
    },
    barRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    barBackground: {
        flex: 1,
        height: 18,
        backgroundColor: "#444",
        borderRadius: 9,
        overflow: "hidden",
    },
    barFill: {
        height: "100%",
        backgroundColor: "#4caf50",
    },
    percent: {
        // width: 45,
        color: "black",
        textAlign: "center",
        fontWeight: "600",
        marginLeft: 8,
    },
    barText: {
        position: "absolute",
        left: 0,
        right: 0,
        textAlign: "center",
        color: "white",
        fontWeight: "700",
        fontSize: 12,
    },
});

const stylesSupplementary = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "flex-start", // label bude úplne vľavo
        alignItems: "center",
        marginVertical: 6,
        paddingVertical: 12,
        paddingHorizontal: width * 0.05,
    },
    label: {
        fontSize: 16,
        color: "black",
        flex: 1, // label zaberie čo najviac miesta
    },
    value: {
        fontSize: 16,
        fontWeight: "600",
        color: "black",
        textAlign: "right", // hodnota bude zarovnaná doprava
    },
});
