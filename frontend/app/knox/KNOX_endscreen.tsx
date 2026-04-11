import { StatMini, StatMiniSupplementary } from "@/components/StatsComponent";
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import { Alert, BackHandler, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../assets/styles/mainScreens.styles";
import { COLORS } from "../../constants/Colors";
import { Theme } from "../../constants/Theme";
import React from "react";

const { width, height } = Dimensions.get("window");

const RETURN_HOME = "/(tabs)/games";
const PLAY_AGAIN = "/knox/KNOX_info";

export default function KNOX_ENDSCREEN() {
    const params = useLocalSearchParams<{
        threeStepSequencesCorrect?: string,
        fourStepSequencesCorrect?: string,
        fiveStepSequencesCorrect?: string,
        sixStepSequencesCorrect?: string,
        sevenStepSequencesCorrect?: string,
        eightStepSequencesCorrect?: string,
        totalCorrect?: string,
        totalScore?: string,
    }>();

    const threeStepSequencesCorrect = Number(params.threeStepSequencesCorrect) || 0;
    const fourStepSequencesCorrect = Number(params.fourStepSequencesCorrect) || 0;
    const fiveStepSequencesCorrect = Number(params.fiveStepSequencesCorrect) || 0;
    const sixStepSequencesCorrect = Number(params.sixStepSequencesCorrect) || 0;
    const sevenStepSequencesCorrect = Number(params.sevenStepSequencesCorrect) || 0;
    const eightStepSequencesCorrect = Number(params.eightStepSequencesCorrect) || 0;
    const totalCorrect = Number(params.totalCorrect) || 0;
    const totalScore = Number(params.totalScore) || 0;
    
    /*
    CATEGORY LOGIC
    */

    function getCategoryIndex(totalScore: number) {
        if (totalScore < 0.6) return 0;
        if (totalScore < 1.5) return 1;
        if (totalScore < 3) return 2;
        if (totalScore < 4) return 3;
        return 4;
    }

    function getCategoryInterpretation(index: number) {
        switch (index) {
            case 0:
                return "Severe difficulties in working memory and inhibition";
            case 1:
                return "Reduced working memory and inhibitory control";
            case 2:
                return "Average working memory and inhibition";
            case 3:
                return "Above average working memory and inhibitory skills";
            case 4:
                return "Excellent working memory and inhibition";
            default:
                return "";
        }
    }

    const categoryIndex = getCategoryIndex(totalScore);

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                // blocks return to the previous screen
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
        "SEVERE\n0 – <0.6",
        "POOR\n0.6 – <1.5",
        "AVERAGE\n1.5 – <3.0",
        "GOOD\n3.0 – <4.0",
        "EXCELLENT\n4.0 – 4.6"
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
                                        ? segmentColors[index] // the current category is lighted up
                                        : inactiveColor,       // other grey
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
                    {/* <StatMini 
                        label="Total score"
                        value={totalScore}
                        percentile={73}
                        max={100}
                    /> */}

                    {/* Vedľajšie štatistiky */}
                    <StatMiniSupplementary label="3-step sequences" value={threeStepSequencesCorrect} whole={2} />
                    <StatMiniSupplementary label="4-step sequences" value={fourStepSequencesCorrect} whole={4} />
                    <StatMiniSupplementary label="5-step sequences" value={fiveStepSequencesCorrect} whole={4} />
                    <StatMiniSupplementary label="6-step sequences" value={sixStepSequencesCorrect} whole={3} />
                    <StatMiniSupplementary label="7-step sequences" value={sevenStepSequencesCorrect} whole={3} />
                    <StatMiniSupplementary label="8-step sequences" value={eightStepSequencesCorrect} whole={2} />
                    <StatMiniSupplementary label="Total correct sequences" value={totalCorrect} whole={18} />
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