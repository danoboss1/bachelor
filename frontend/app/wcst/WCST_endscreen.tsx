import { StatMiniSupplementary } from '@/components/StatsComponent';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams, useFocusEffect } from "expo-router";
import React, { useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View, BackHandler, Alert } from "react-native";
import { styles } from "../../assets/styles/mainScreens.styles";
import { COLORS } from "../../constants/Colors";
import { Theme } from "../../constants/Theme";

const { width, height } = Dimensions.get("window");

const RETURN_HOME = "/(tabs)/games";
const PLAY_AGAIN = "/wcst/WCST_info";

export default function WCST_ENDSCREEN() {

    const params = useLocalSearchParams<{
        trialsAdministered?: string;
        totalCorrect?: string;
        totalError?: string;
        perseverativeResponses?: string;
        perseverativeErrors?: string;
        nonPerseverativeErrors?: string;
        categoriesCompleted?: string;
        failureToMaintainSet?: string;
        trialsToFirstCategory?: string;
        perseverativePercent?: string;
        perseverativeErrorPercent?: string;
        nonPerseverativeErrorPercent?: string;
        errorPercent?: string;
    }>();

    const trials = Number(params.trialsAdministered) || 0;
    const totalCorrect = Number(params.totalCorrect) || 0;
    const totalError = Number(params.totalError) || 0;
    const perseverativeResponses = Number(params.perseverativeResponses) || 0;
    const perseverativeErrors = Number(params.perseverativeErrors) || 0;
    const nonPerseverativeErrors = Number(params.nonPerseverativeErrors) || 0;
    const categoriesCompleted = Number(params.categoriesCompleted) || 0;
    const failureToMaintainSet = Number(params.failureToMaintainSet) || 0;
    const trialsToFirstCategory = Number(params.trialsToFirstCategory) || 0;
    const perseverativePercent = Number(params.perseverativePercent) || 0;
    const perseverativeErrorPercent = Number(params.perseverativeErrorPercent) || 0;
    const nonPerseverativeErrorPercent = Number(params.nonPerseverativeErrorPercent) || 0;
    const errorPercent = Number(params.errorPercent) || 0;

    const [percentiles, setPercentiles] = useState({
        trials: 0,
        perseverativeResponses: 0,
        perseverativeErrors: 0,
        nonPerseverativeErrors: 0,
    });

    /*
    CATEGORY LOGIC
    */

    function getCategoryIndex(categoriesCompleted: number, trials: number) {
        if (categoriesCompleted <= 2) return 0;
        if (categoriesCompleted <= 4) return 1;
        if (categoriesCompleted === 5) return 2;
        if (categoriesCompleted === 6 && trials >= 85) return 3;
        if (categoriesCompleted === 6 && trials < 85) return 4;

        return 0;
    }

    function getCategoryInterpretation(index: number) {
        switch (index) {
            case 0: return "Severe difficulties in responding to feedback and cognitive flexibility";
            case 1: return "Reduced ability in responding to feedback and cognitive flexibility";
            case 2: return "Average responding to feedback and cognitive flexibility";
            case 3: return "Above average responding to feedback and cognitive flexibility";
            case 4: return "Excellent responding to feedback and cognitive flexibility";
            default: return "";
        }
    }

    const categoryIndex = getCategoryIndex(categoriesCompleted, trials);

    /*
    FETCH PERCENTILES
    */

    useEffect(() => {
        async function fetchPercentile(metric: string, value: number) {
            try {
                const response = await fetch(
                    `https://bachelor-pi.vercel.app/stats/percentile?metric=${metric}&value=${value}`
                );

                const data = await response.json();
                return data.percentile ?? 0;
            } catch {
                return 0;
            }
        }

        async function fetchAll() {
            const trialsP = await fetchPercentile("trials_administered", trials);
            const prP = await fetchPercentile("perseverative_responses", perseverativeResponses);
            const peP = await fetchPercentile("perseverative_errors", perseverativeErrors);
            const npeP = await fetchPercentile("non_perseverative_errors", nonPerseverativeErrors);

            setPercentiles({
                trials: trialsP,
                perseverativeResponses: prP,
                perseverativeErrors: peP,
                nonPerseverativeErrors: npeP,
            });
        }

        fetchAll();
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                Alert.alert(
                    "Return to Home",
                    "Do you want to go back to Games Home?",
                    [
                        { text: "Cancel", style: "cancel" },
                        { text: "Yes", style: "destructive", onPress: () => router.replace(RETURN_HOME) }
                    ]
                );
                return true;
            };

            const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);
            return () => subscription.remove();
        }, [])
    );

    const labels = [
        "SEVERE\n0-2 categories",
        "POOR\n3-4 categories",
        "AVERAGE\n5 categories",
        "GOOD\n6 categories",
        "EXCELLENT\n<85 cards"
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
                        Categories completed: {categoriesCompleted}
                    </Text>

                    <Text style={localStyles.resultText}>
                        Cards used: {trials}
                    </Text>

                    <Text style={[localStyles.resultInterpretation, { color: "black" }]}>
                        {getCategoryInterpretation(categoryIndex)}
                    </Text>

                </View>

            </View>

            {/* MAIN STATS */}
            <View style={{ flex: 3, width: "100%" }}>
                <ScrollView
                    style={{ width: "100%", flex: 3 }}
                    contentContainerStyle={{ alignItems: "stretch" }}
                >
                    <View style={localStyles.separator} />

                    <StatMiniSupplementary 
                        label="Percentage of perseverative responses"
                        value={`${perseverativePercent}%`}
                    />

                    <StatMiniSupplementary 
                        label="Percentage of perseverative errors"
                        value={`${perseverativeErrorPercent}%`}
                    />

                    <StatMiniSupplementary
                        label="Percentage of non-perseverative errors"
                        value={`${nonPerseverativeErrorPercent}%`}
                    />

                    <StatMiniSupplementary
                        label="Correct responses"
                        value={totalCorrect}
                    />

                    <StatMiniSupplementary
                        label="Errors"
                        value={totalError}
                    />

                    <StatMiniSupplementary
                        label="Error percentage"
                        value={`${errorPercent}%`}
                    />

                    <StatMiniSupplementary
                        label="Perseverative responses"
                        value={perseverativeResponses}
                    />

                    <StatMiniSupplementary
                        label="Perseverative errors"
                        value={perseverativeErrors}
                    />

                    <StatMiniSupplementary
                        label="Non-perseverative errors"
                        value={nonPerseverativeErrors}
                    />

                    <StatMiniSupplementary
                        label="Trials to first category"
                        value={trialsToFirstCategory}
                    />

                    <StatMiniSupplementary
                        label="Failure to maintain set"
                        value={failureToMaintainSet}
                    />
                </ScrollView>
            </View>

            {/* BUTTONS */}
            <View style={localStyles.buttonContainer}>

                <TouchableOpacity
                    style={[
                        localStyles.button,
                        { 
                            backgroundColor: COLORS.primary,
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
                            backgroundColor: COLORS.primary,
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
    );
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
        width: "100%"
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
});