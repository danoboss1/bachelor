import { StatMini, StatMiniSupplementary } from "@/components/StatsComponent";
import { router, useLocalSearchParams } from "expo-router";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../assets/styles/mainScreens.styles";
import { COLORS } from "../../constants/Colors";
import { Theme } from "../../constants/Theme";

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

    return (
        <View style={localStyles.container}>
            <Text style={localStyles.title}>Test Completed</Text>

            {/* Hlavná štatistika */}
            <ScrollView contentContainerStyle={localStyles.statsScroll}>
                <StatMini 
                    label="Total score"
                    value={totalScore}
                    percentile={73}
                    max={100}
                />

                {/* Vedľajšie štatistiky */}
                <StatMiniSupplementary label="4-moves sequences" value={fourMovesSequencesCorrect} whole={8} />
                <StatMiniSupplementary label="5-moves sequences" value={fiveMovesSequencesCorrect} whole={8} />
                <StatMiniSupplementary label="6-moves sequences" value={sixMovesSequencesCorrect} whole={8} />
                <StatMiniSupplementary label="Total correct sequences" value={totalCorrect} whole={24} />
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
    )
}


const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: height * 0.026,
        alignItems: "center",
        justifyContent: "space-between",
        // backgroundColor: "#dceeff",
        // backgroundColor: "#f9f9f9",
        backgroundColor: "#d6c7b9",
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
})