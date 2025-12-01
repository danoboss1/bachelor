import { StatMini, StatMiniSupplementary } from '@/components/StatsComponent';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from 'react';
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

    const [trialsPercentile, setTrialsPercentile] = useState<number | null>(null);

    useEffect(() => {
        async function fetchTrialsPercentile() {
            try {
                const response = await fetch(
                    `https://bachelor-6zigep6fn-daniel-sehnouteks-projects.vercel.app/stats/percentile/trials-administered?value=${trials}`
                );
                const data = await response.json();
                setTrialsPercentile(data.percentile);
            } catch (error) {
                console.error("Failed to fetch trials percentile:", error);
                setTrialsPercentile(null);
            }
        }

        if (trials > 0) {
            fetchTrialsPercentile();
        } else {
            setTrialsPercentile(0);
        }
    }, [trials]);

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
                        max={26} 
                    />
                    <StatMini 
                        label="Percentage of perseverative responses" 
                        value={perseverativePercent} 
                        max={52} 
                        showPercentSign={true}
                    />
                    <StatMini 
                        label="Percentage of perseverative errors" 
                        value={perseverativeErrorPercent} 
                        max={85} 
                        showPercentSign={true}
                    />
                    <StatMini 
                        label="Percentage of non-perseverative errors" 
                        value={nonPerseverativeErrorPercent} 
                        max={14} 
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