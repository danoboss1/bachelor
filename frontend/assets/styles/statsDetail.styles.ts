import React from "react";
import { StyleSheet, Dimensions } from "react-native";
import { Color } from "@/constants/TWPalette";

const { width, height } = Dimensions.get("window");


export const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Color.orange[100],
        paddingTop: Math.max(12, height * 0.02),
    },

    header: {
        marginTop: 8,
        paddingHorizontal: 16,
        paddingBottom: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    title: {
        fontSize: 22,
        fontWeight: "800",
        color: Color.gray[900],
    },
    subtitle: {
        margin: 2,
        fontSize: 13,
        fontWeight: "500",
        color: Color.gray[600],
    },
    backBtn: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 12,
        backgroundColor: "#B3B3B3"
    },

    card: {
        marginHorizontal: 16,
        marginTop: 12,
        padding: 14,
        borderRadius: 18,
        backgroundColor: "#FFFCF9",
        borderWidth: 1,
        borderColor: "#F0DFC8",
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: "800",
        color: Color.gray[900],
    },
    cardBar: {
        padding: 14,
        backgroundColor: "#FFFCF9",
        borderWidth: 1,
        borderColor: "#F0DFC8",
    },

    scroll: { 
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 12,
    },
    graphTitle: {
        fontSize: 16,
        fontWeight: "600",
        marginLeft: width * 0.1,
        color: "black",
        textAlign: "left",
    },

    scaleContainer: {
        width: width * 0.9,
        flex: 2,
        justifyContent: "center",
    },
    scaleBar: {
        flexDirection: "row",
        height: 60,
        borderRadius: 16,
        overflow: "hidden"
    },
    segment: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 4,
    },
    segmentText: {
        color: "white",
        fontSize: 10,
        fontWeight: "bold",
        textAlign: "center",
        lineHeight: 12,
    },
    red: {
        backgroundColor: "#e53935"
    },
    orange: {
        backgroundColor: "#fb8c00"
    },
    yellow: {
        backgroundColor: "#fdd835"
    },
    lightGreen: {
        backgroundColor: "#7cb342"
    },
    darkGreen: {
        backgroundColor: "#2e7d32"
    },

    highlightRow: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 14,
        backgroundColor: "#F5F5F5",
        paddingVertical: 10,
        paddingHorizontal: 12,
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
    },
    highlightDivider: {
        width: 1,
        height: 36,
        backgroundColor: "#E6E6E6",
    },
    highlightSingle: {
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 14,
        backgroundColor: "#F5F5F5",
        paddingVertical: 14,
        paddingHorizontal: 12,
    },

    resultContainer: {
        alignItems: "center",
    },
    resultText: {
        fontSize: 24,
    },
    resultInterpretation: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 16,
        textAlign: "center",
    },
    trendPrimary: {
        marginTop: 10,
        fontSize: 15,
        fontWeight: "800",
        color: "#111",
        textAlign: "center",
        paddingHorizontal: 6,
    },
    interpretationSmall: {
        marginVertical: 12,
        fontSize: 12,
        fontWeight: "600",
        color: Color.gray[700],
        textAlign: "center",
        paddingHorizontal: 6,
    },
});