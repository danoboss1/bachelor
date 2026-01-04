import { StatMini, StatMiniSupplementary } from '@/components/StatsComponent';
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

    const [percentiles, setPercentiles] = useState<{
        trials: number | null;
        perseverativeResponses: number | null;
        perseverativeErrors: number | null;
        nonPerseverativeErrors: number | null;
    }>({
        trials: null,
        perseverativeResponses: null,
        perseverativeErrors: null,
        nonPerseverativeErrors: null,
    });

    useEffect(() => {
        async function fetchPercentile(metric: string, value: number) {
            try {
                const response = await fetch(
                    `https://bachelor-pi.vercel.app/stats/percentile?metric=${metric}&value=${value}`
                );
                const data = await response.json();
                return data.percentile;
            } catch (error) {
                console.error(`Failed to fetch percentile for ${metric}:`, error);
                return null;
            }
        }

        async function fetchAllPercentiles() {
            const [
                trialsPercentile,
                perseverativeResponsesPercentile,
                perseverativeErrorsPercentile,
                nonPerseverativeErrorsPercentile
            ] = await Promise.all([
                fetchPercentile("trials_administered", trials),
                fetchPercentile("perseverative_responses", perseverativeResponses),
                fetchPercentile("perseverative_errors", perseverativeErrors),
                fetchPercentile("non_perseverative_errors", nonPerseverativeErrors),
            ]);

            setPercentiles({
                trials: trialsPercentile ?? 0,
                perseverativeResponses: perseverativeResponsesPercentile ?? 0,
                perseverativeErrors: perseverativeErrorsPercentile ?? 0,
                nonPerseverativeErrors: nonPerseverativeErrorsPercentile ?? 0,
            });
        }

        fetchAllPercentiles();
    }, [trials, perseverativeResponses, perseverativeErrors, nonPerseverativeErrors]);

    return (
        <LinearGradient
            colors={[COLORS.gradient_orange, COLORS.gradient_yellow]} 
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.container}
        >
            <View style={localStyles.container}>

                <Text style={localStyles.title}>Test Completed</Text>

                {/* Hlavné štatistiky */}
                <ScrollView contentContainerStyle={localStyles.statsScroll}>
                    <StatMini 
                        label="Total number of trials administered" 
                        value={trials}
                        percentile={percentiles.trials ?? 0} 
                        max={100} 
                    />
                    <StatMini 
                        label="Percentage of perseverative responses" 
                        value={perseverativePercent}
                        percentile={percentiles.perseverativeResponses ?? 0} 
                        max={100} 
                        showPercentSign={true}
                    />
                    <StatMini 
                        label="Percentage of perseverative errors" 
                        value={perseverativeErrorPercent}
                        percentile={percentiles.perseverativeErrors ?? 0} 
                        max={100} 
                        showPercentSign={true}
                    />
                    <StatMini 
                        label="Percentage of non-perseverative errors" 
                        value={nonPerseverativeErrorPercent}
                        percentile={percentiles.nonPerseverativeErrors ?? 0} 
                        max={100} 
                        showPercentSign={true}
                    />

                    <View style={localStyles.separator} />

                    {/* Vedľajšie štatistiky */}
                    <StatMiniSupplementary label="Number of categories completed" value={categoriesCompleted} />
                    <StatMiniSupplementary label="Correct responses" value={totalCorrect} />
                    <StatMiniSupplementary label="Errors" value={totalError} />
                    <StatMiniSupplementary label="Percentage of errors" value={`${errorPercent}%`} />
                    <StatMiniSupplementary label="Perseverative responses" value={perseverativeResponses} />
                    <StatMiniSupplementary label="Perseverative errors" value={perseverativeErrors} />
                    <StatMiniSupplementary label="Non-perseverative errors" value={nonPerseverativeErrors} />
                    <StatMiniSupplementary label="Trials to complete first category" value={trialsToFirstCategory} />
                    <StatMiniSupplementary label="Failure to maintain set" value={failureToMaintainSet} />
                </ScrollView>

                {/* Tlačidlá stále viditeľné */}
                <View style={localStyles.buttonContainer}>
                    <TouchableOpacity 
                        style={[localStyles.button, { backgroundColor: COLORS.green_button }]}
                        onPress={() => router.replace(RETURN_HOME)}
                    >
                        <Text style={styles.buttonTextWhite}>Return Home</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[localStyles.button, { backgroundColor: COLORS.blue_button }]}
                        onPress={() => router.replace(PLAY_AGAIN)}
                    >
                        <Text style={styles.buttonTextWhite}>Play Again</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>
    );
}

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: height * 0.026,
        alignItems: "center",
        justifyContent: "space-between",
    },
    title: {
        fontSize: Theme.typography.h1,
        fontWeight: "bold",
        color: "#000",
        marginBottom: height * 0.03,
        textAlign: "center",
        marginTop: height * 0.04,
    },
    statsScroll: {
        width: "100%",
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: height * 0.05,
        textAlign: "center",
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        alignItems: "center",     
        justifyContent: "center",
        paddingVertical: height * 0.02,
        borderRadius: Theme.button.radius,
        marginHorizontal: width * 0.015,
    },
    separator: {
        marginVertical: height * 0.025,
        height: StyleSheet.hairlineWidth,
        backgroundColor: "#ccc",
        marginHorizontal: width * 0.05,
        width: width * 0.9,
    },
});

// nativne skalovanie textu bez width, height. Vyskusat potom neskor
// fontSize: RFValue(22), // text bude škálovaný podľa veľkosti obrazovky
// import { RFValue } from "react-native-responsive-fontsize";