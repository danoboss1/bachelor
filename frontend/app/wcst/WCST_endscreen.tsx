import { StatMiniSupplementary } from '@/components/StatsComponent';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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

        if (categoriesCompleted === 6 && trials > 85)
            return 3;

        if (categoriesCompleted === 6 && trials <= 85)
            return 4;

        return 0;
    }

    function getCategoryInterpretation(index: number) {

        switch (index) {

            case 0:
                return "Severe impairment of cognitive flexibility";

            case 1:
                return "Reduced cognitive flexibility";

            case 2:
                return "Average cognitive flexibility";

            case 3:
                return "Above average cognitive flexibility";

            case 4:
                return "Superior cognitive flexibility";

            default:
                return "";
        }
    }

    const categoryIndex = getCategoryIndex(categoriesCompleted, trials);

    /*
    FETCH PERCENTILES
    */


    // POTIALTO TO CHAPEM
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

            const trialsP =
                await fetchPercentile("trials_administered", trials);

            const prP =
                await fetchPercentile("perseverative_responses", perseverativeResponses);

            const peP =
                await fetchPercentile("perseverative_errors", perseverativeErrors);

            const npeP =
                await fetchPercentile("non_perseverative_errors", nonPerseverativeErrors);

            setPercentiles({
                trials: trialsP,
                perseverativeResponses: prP,
                perseverativeErrors: peP,
                nonPerseverativeErrors: npeP,
            });
        }

        fetchAll();

    }, []);

    return (

        <LinearGradient
            colors={[
                COLORS.gradient_orange,
                COLORS.gradient_yellow
            ]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.container}
        >

            <View style={localStyles.container}>

                <Text style={localStyles.title}>
                    Test Completed
                </Text>

                {/* INTERPRETATION BAR */}

                <View style={[localStyles.scaleContainer, { flex: 1}]}>

                    <View style={localStyles.scaleBar}>
                        <View style={[localStyles.segment, localStyles.red]}>
                            <Text style={localStyles.segmentText}>
                                VERY POOR{"\n"}0-2 categories
                            </Text>
                        </View>

                        <View style={[localStyles.segment, localStyles.orange]}>
                            <Text style={localStyles.segmentText}>
                                POOR{"\n"}3-4 categories
                            </Text>
                        </View>

                        <View style={[localStyles.segment, localStyles.yellow]}>
                            <Text style={[localStyles.segmentText, { color: "black" }]}>
                                NORMAL{"\n"}5 categories
                            </Text>
                        </View>

                        <View style={[localStyles.segment, localStyles.lightGreen]}>
                            <Text style={localStyles.segmentText}>
                                GOOD{"\n"}6 categories
                            </Text>
                        </View>

                        <View style={[localStyles.segment, localStyles.darkGreen]}>
                            <Text style={localStyles.segmentText}>
                                EXCELLENT{"\n"}≤85 cards
                            </Text>
                        </View>
                    </View>

                    {/* ARROW */}

                    <View style={localStyles.arrowContainer}>

                        <View
                            style={[
                                localStyles.arrowWrapper,
                                {
                                    left: `${categoryIndex * 18 + 5 + 9}%`
                                }
                            ]}
                        >

                            <Text style={localStyles.arrow}>
                                ▲
                            </Text>

                            {/* <Text style={localStyles.arrowLabel}>
                                Categories completed: {categoriesCompleted}{"\n"}
                                Trials administered: {trials}
                            </Text> */}

                        </View>

                    </View>

                    {/* RESULT TEXT */}

                    <View style={localStyles.resultContainer}>

                        {/* <Text style={localStyles.resultText}>
                            Categories completed: {categoriesCompleted}
                        </Text>

                        <Text style={localStyles.resultText}>
                            Trials administered: {trials}
                        </Text> */}

                        <Text style={localStyles.resultInterpretation}>
                            {getCategoryInterpretation(categoryIndex)}
                        </Text>

                    </View>

                </View>

                {/* MAIN STATS */}

                <ScrollView
                    style={{ width: "100%", flex: 3 }}
                    contentContainerStyle={{ alignItems: "stretch" }}
                >

                    {/* <StatMini
                        label="Total number of trials administered"
                        value={trials}
                        percentile={percentiles.trials}
                    /> */}

                    <View style={localStyles.separator} />

                    <StatMiniSupplementary
                        label="Categories completed"
                        value={categoriesCompleted}
                    />

                    <StatMiniSupplementary
                        label="Trials administered"
                        value={trials}
                    />
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

                {/* BUTTONS */}

                <View style={localStyles.buttonContainer}>

                    <TouchableOpacity
                        style={[
                            localStyles.button,
                            { backgroundColor: COLORS.green_button }
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
                            { backgroundColor: COLORS.blue_button }
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

        </LinearGradient>

    );
}

const localStyles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: height * 0.03
    },

    title: {
        fontSize: Theme.typography.h1,
        fontWeight: "bold",
        marginTop: 20,
    },

    scaleContainer: {
        width: width * 0.9,
        marginTop: 30,
        marginBottom: 20,
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

    arrowContainer: {
        height: 50,
        justifyContent: "center"
    },

    arrowWrapper: {
        position: "absolute",
        alignItems: "center",
        transform: [{ translateX: -40 }]
    },

    arrow: {
        fontSize: 28,
        fontWeight: "bold"
    },

    arrowLabel: {
        fontSize: 12
    },

    resultContainer: {
        alignItems: "center",
        marginTop: 8
    },

    resultText: {
        fontSize: 16,
        fontWeight: "600"
    },

    resultInterpretation: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 4,
        textAlign: "center"
    },

    statsScroll: {
        width: "100%"
    },

    separator: {
        height: 1,
        backgroundColor: "#ccc",
        marginVertical: 15
    },

    buttonContainer: {
        flexDirection: "row",
        marginBottom: 40
    },

    button: {
        flex: 1,
        padding: 15,
        marginHorizontal: 5,
        borderRadius: 10,
        alignItems: "center"
    }

});


// nativne skalovanie textu bez width, height. Vyskusat potom neskor
// fontSize: RFValue(22), // text bude škálovaný podľa veľkosti obrazovky
// import { RFValue } from "react-native-responsive-fontsize";