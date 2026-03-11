import { router } from "expo-router";
import React from "react";
import { ActivityIndicator, Dimensions, ImageBackground, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../assets/styles/mainScreens.styles";
import { Color } from "@/constants/TWPalette";
import { COLORS } from '@/constants/Colors';


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

function formatDate(dateString: string | null) {
    if (!dateString) return "—";

    const [year, month, day] = dateString.split("-");
    return `${day}.${month}.${year}`;
}

function formatDateRange(start: string | null, end: string | null) {
    if (!start || !end) return "No recent data";
    return `${formatDate(start)} - ${formatDate(end)}`;
}

const labels = [
    "VERY POOR\n0-2 categories",
    "POOR\n3-4 categories",
    "NORMAL\n5 categories",
    "GOOD\n6 categories",
    "EXCELLENT\n≤85 cards",
];

const segmentColors = ["#e53935", "#fb8c00", "#FBC02D", "#7cb342", "#2e7d32"];
const inactiveColor = "#666";

type StatCardProps = {
    title: string;
    loadingRecent: boolean;
    windowStart: string | null;
    windowEnd: string | null;
    // labels: string[];
    categoryIndex: number;
    interpretation: string;
    hasData: boolean;
    primaryValue: number | null;
    primaryLabel: string;
    secondaryValue?: number | null;
    secondaryLabel?: string;
    image?: ImageSourcePropType;
    path: "/wcst/WCST_stats_detail" | "/tol/TOL_stats_detail" | "/knox/KNOX_stats_detail";
}

export function StatCard({
    title, 
    loadingRecent,
    windowStart,
    windowEnd,
    // labels,
    categoryIndex,
    interpretation,
    hasData,
    primaryValue,
    primaryLabel,
    secondaryValue,
    secondaryLabel,
    image = require("../assets/images/backgroundBroskyna.png"),
    path,
} : StatCardProps) {
    const hasSecondary =
        secondaryLabel !== undefined && secondaryValue !== undefined;

    return (
        <View style={stylesStatCard.card}>
            <ImageBackground
                source={image}
                style={stylesStatCard.cardBackground}
                imageStyle={stylesStatCard.cardImage}
            >
                <View style={stylesStatCard.cardOverlay}>
                    {/* <View style={stylesStatCard.titleRow}>
                        <Text style={stylesStatCard.dateBadge}>
                            {formatDateRange(data.windowStart, data.windowEnd)}
                        </Text>

                        <Text style={stylesStatCard.cardTitle}>
                            Wisconsin Card Sorting Test{"\n"}Recent Performance
                        </Text>
                    </View> */}

                    <View style={stylesStatCard.titleRow}>
                        <Text style={stylesStatCard.dateText}>
                            {formatDateRange(windowStart, windowEnd)}
                        </Text>

                        <Text style={stylesStatCard.cardTitle}>
                            {title}
                        </Text>
                    </View>
                    
                    {loadingRecent ? (
                        <View style={stylesStatCard.loadingContainer}>
                            <ActivityIndicator size="small" color={COLORS.primary} />
                        </View>
                    ) : (
                        <>
                            <View style={stylesStatCard.scaleBar}>
                                {labels.map((label, index) => (
                                    <View
                                        key={index}
                                        style={[
                                            stylesStatCard.segment,
                                            {
                                                backgroundColor:
                                                    index === categoryIndex
                                                        ? segmentColors[index]
                                                        : inactiveColor,
                                                borderRightWidth:
                                                    index < labels.length - 1 ? 1 : 0,
                                                borderRightColor: "#999",
                                            },
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                stylesStatCard.segmentText,
                                                {
                                                    color:
                                                        categoryIndex === 2 && index === 2
                                                            ? "#333"
                                                            : "white",
                                                },
                                            ]}
                                        >
                                            {label}
                                        </Text>
                                    </View>
                                ))}
                            </View>

                            <View style={stylesStatCard.resultContainer}>
                                <Text style={stylesStatCard.interpretationSmall}>
                                    {interpretation}
                                </Text>

                                <View style={stylesStatCard.highlightRow}>
                                    <View style={stylesStatCard.highlightBox}>
                                        <Text style={stylesStatCard.highlightValue}>
                                            {hasData ? primaryValue : "—"}
                                            {/* toto takto druhe asi nebudem chciet, ale vsak uvidim */}
                                            {/* {hasData ? primaryValue ?? "—" : "—"} */}
                                        </Text>
                                        <Text style={stylesStatCard.highlightLabel}>
                                            Categories
                                        </Text>
                                    </View>
                                    {hasSecondary ? (
                                        <>
                                             <View style={stylesStatCard.highlightDivider} />

                                            <View style={stylesStatCard.highlightBox}>
                                                <Text style={stylesStatCard.highlightValue}>
                                                    {hasData ? secondaryValue : "—"}
                                                </Text>
                                                <Text style={stylesStatCard.highlightLabel}>
                                                    Cards used
                                                </Text>
                                            </View>
                                        </>
                                    ): null}
                                </View>
                            </View>
                        </>
                    )}

                    <TouchableOpacity
                        style={stylesStatCard.moreLink}
                        onPress={() => router.push(path)}
                        activeOpacity={0.8}
                    >
                        <Text style={stylesStatCard.moreLinkText}>View details</Text>
                        <Text style={stylesStatCard.moreLinkArrow}>→</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
};

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

const stylesStatCard = StyleSheet.create({
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
        backgroundColor: "transparent",
    },
    cardBackground: {
        width: "100%",
    },
    cardImage: {
        borderRadius: 16,
    },
    cardOverlay: {
        padding: 16,
    },
    titleRow: {
        marginBottom: 14,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: Color.gray[900],
        textAlign: "center",
    },
    dateBadge: {
        position: "absolute",
        top: 0,
        right: 0,
        fontSize: 11,
        fontWeight: "700",
        color: Color.gray[700],
        backgroundColor: "rgba(255,255,255,0.82)",
        paddingHorizontal: 8,
        // paddingBottom: 8,
        // marginBottom: 54,
        paddingVertical: 4,
        borderRadius: 10,
        overflow: "hidden",
    },
    scaleBar: {
        flexDirection: "row",
        height: 60,
        borderRadius: 16,
        overflow: "hidden",
        marginBottom: 12,
    },
    segment: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 3,
        paddingVertical: 4,
    },
    segmentText: {
        color: "white",
        fontSize: 9,
        fontWeight: "bold",
        textAlign: "center",
        lineHeight: 11,
    },
    highlightRow: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 14,
        backgroundColor: "rgba(255,255,255,0.78)",
        borderWidth: 1,
        borderColor: "#F0D8C9",
        paddingVertical: 10,
        paddingHorizontal: 12,
        width: "100%",
    },
    highlightBox: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
    },
    highlightValue: {
        fontSize: 22,
        fontWeight: "900",
        color: Color.gray[900],
    },
    highlightLabel: {
        fontSize: 12,
        fontWeight: "700",
        color: Color.gray[600],
        textAlign: "center",
    },
    highlightDivider: {
        width: 1,
        height: 36,
        backgroundColor: "#EBCFC0",
    },
    resultContainer: {
        alignItems: "center",
        width: "100%",
    },
    interpretationSmall: {
        marginBottom: 12,
        fontSize: 14,
        fontWeight: "700",
        color: Color.gray[800],
        textAlign: "center",
        paddingHorizontal: 6,
    },
    moreLink: {
        marginTop: 14,
        alignSelf: "stretch",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        paddingVertical: 11,
        borderRadius: 12,
        backgroundColor: "rgba(255,255,255,0.55)",
        borderWidth: 2,
        borderColor: "#EED7C8",
        // borderColor: COLORS.primary
    },
    moreLinkText: {
        fontSize: 14,
        fontWeight: "700",
        color: Color.gray[700],
    },
    moreLinkArrow: {
        fontSize: 16,
        fontWeight: "800",
        color: Color.gray[700],
    },
    dateText: {
        alignSelf: "flex-end",
        fontSize: 11,
        fontWeight: "600",
        color: Color.gray[600],
        marginBottom: 6,
    },
    loadingContainer: {
        paddingVertical: 30,
        alignItems: "center",
        justifyContent: "center",
    },
});
