import { StatMini, StatMiniSupplementary } from "@/components/StatsComponent";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import { Alert, BackHandler, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../assets/styles/mainScreens.styles";
import { COLORS } from "../../constants/Colors";
import { Theme } from "../../constants/Theme";
import React from "react";

const { width, height } = Dimensions.get("window");

const RETURN_HOME = "/(tabs)/games";
const PLAY_AGAIN = "/tol/TOL_info";

export default function TOL_ENDSCREEN() {
    const params = useLocalSearchParams<{
        fourMovesSequencesCorrect?: string,
        fiveMovesSequencesCorrect?: string,
        sixMovesSequencesCorrect?: string,
        totalCorrect?: string,
        totalScore?: string,
    }>();

    const fourMovesSequencesCorrect = Number(params.fourMovesSequencesCorrect) || 0;
    const fiveMovesSequencesCorrect = Number(params.fiveMovesSequencesCorrect) || 0;
    const sixMovesSequencesCorrect = Number(params.sixMovesSequencesCorrect) || 0;
    const totalCorrect = Number(params.totalCorrect) || 0;
    const totalScore = Number(params.totalScore) || 0;

    /*
    CATEGORY LOGIC
    */

    function getCategoryIndex(score: number) {
        if (score < 0.8) return 0;
        if (score < 2.3) return 1;
        if (score < 4.5) return 2;
        if (score < 6.0) return 3;

        return 4;
    }

    function getCategoryInterpretation(index: number) {
        switch (index) {
            case 0: return "Severe difficulties in planning and decision-making";
            case 1: return "Reduced planning and decision-making skills";
            case 2: return "Average planning and decision-making skills";
            case 3: return "Above average planning and decision-making skills";
            case 4: return "Excellent planning and decision-making skills";
            default: return "";
        }
    }

    const categoryIndex = getCategoryIndex(totalScore);

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                // blocks return to a previous screen
                Alert.alert(
                    "Return to Home",
                    "Do you want to go back to Games Home?",
                    [
                        { text: "Cancel", style: "cancel" },
                        { text: "Yes", style: "destructive", onPress: () => router.replace(RETURN_HOME) }
                    ]
                );
                return true; // blocks default behavior
            };

            const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
            return () => subscription.remove();
        }, [])
    );

    const labels = [
        "SEVERE\n0 – <0.8",
        "POOR\n0.8 – <2.3",
        "AVERAGE\n2.3 – <4.5",
        "GOOD\n4.5 – <6.0",
        "EXCELLENT\n6.0 – 6.8"
    ];

    const segmentColors = ["#e53935", "#fb8c00", "#FBC02D", "#7cb342", "#2e7d32"];
    const inactiveColor = "#666";

    return (
        <View style={localStyles.container}>
            <View style={localStyles.titleContainer}>
                <Text style={localStyles.title}>
                    Test Completed
                </Text>
            </View>

            {/* INTERPRETATION BAR */}
            <View style={localStyles.scaleContainer}>
                <View style={localStyles.scaleBar}>
                    {labels.map((label, index) => (
                        <View
                            key={index}
                            style={[
                                localStyles.segment,
                                {
                                    backgroundColor: index === categoryIndex
                                        ? segmentColors[index] 
                                        : inactiveColor,       
                                    borderRightWidth: index < labels.length - 1 ? 1 : 0,
                                    borderRightColor: "#999" 
                                }
                            ]}
                        >
                            <Text style={[
                                localStyles.segmentText,
                                { color: categoryIndex === 2 && index === 2 ? "#333" : "white" }
                            ]}>
                                {label}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* RESULT TEXT */}

                <View style={localStyles.resultContainer}>

                    <Text style={localStyles.resultText}>
                        Total score: {Number(totalScore.toFixed(3))}
                    </Text>

                    <Text style={[localStyles.resultInterpretation, { color: "black" }]}>
                        {getCategoryInterpretation(categoryIndex)}
                    </Text>

                </View>
            </View>

            {/* Hlavná štatistika */}
            <View style={{ flex: 3, width: "100%" }}>
                <ScrollView
                    style={{ width: "100%", flex: 3 }}
                    contentContainerStyle={{ alignItems: "stretch" }}
                >   
                    <View style={localStyles.separator} />
                    {/* Vedľajšie štatistiky */}
                    <StatMiniSupplementary label="4-moves sequences" value={fourMovesSequencesCorrect} whole={8} />
                    <StatMiniSupplementary label="5-moves sequences" value={fiveMovesSequencesCorrect} whole={8} />
                    <StatMiniSupplementary label="6-moves sequences" value={sixMovesSequencesCorrect} whole={8} />
                    <StatMiniSupplementary label="Total correct sequences" value={totalCorrect} whole={24} />
                </ScrollView>
            </View>

            {/* Tlačidlá stále viditeľné */}
            <View style={localStyles.buttonContainer}>
                <TouchableOpacity 
                    style={[
                        localStyles.button, 
                        { 
                            backgroundColor: COLORS.primary 
                        }
                    ]}
                    onPress={() => 
                        router.replace(RETURN_HOME)
                    }
                >
                    <Text style={styles.buttonTextWhite}>
                        Return Home
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[
                        localStyles.button, 
                        { 
                            backgroundColor: COLORS.primary 
                        }
                    ]}
                    onPress={() => 
                        router.replace(PLAY_AGAIN)
                    }
                >
                    <Text style={styles.buttonTextWhite}>
                        Play Again
                    </Text>
                </TouchableOpacity>

            </View>
        </View>
    )
}


const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingTop: height * 0.03,
        backgroundColor: COLORS.primary_broskynova
    },
    title: {
        fontSize: Theme.typography.h1,
        fontWeight: "bold",
        marginTop: 20,
    },
    titleContainer: {
        alignItems: "center",
        marginBottom: 16,    
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
    resultContainer: {
        alignItems: "center",
        marginTop: 32,
    },
    resultText: {
        fontSize: 16,
    },
    resultInterpretation: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 16,
        textAlign: "center",
    },
    statsScroll: {
        width: "100%",
    },
    separator: {
        height: 1,
        backgroundColor: "#ccc",
        marginBottom: 16,
        marginTop: 4,
    },
    buttonContainer: {
        flexDirection: "row",
        marginBottom: 40,
        justifyContent: "center",
        gap: 12, 
    },
    button: {
        width: width * 0.4,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FF1E1E",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        minHeight: 48,
        minWidth: 60,
    },
})