import { StatMini, StatMiniSupplementary } from "@/components/StatsComponent";
import { router, useLocalSearchParams } from "expo-router";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../assets/styles/mainScreens.styles";
import { COLORS } from "../../constants/Colors";
import { Theme } from "../../constants/Theme";

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
    }>();

    const threeStepSequencesCorrect = Number(params.threeStepSequencesCorrect) || 0;
    const fourStepSequencesCorrect = Number(params.fourStepSequencesCorrect) || 0;
    const fiveStepSequencesCorrect = Number(params.fiveStepSequencesCorrect) || 0;
    const sixStepSequencesCorrect = Number(params.sixStepSequencesCorrect) || 0;
    const sevenStepSequencesCorrect = Number(params.sevenStepSequencesCorrect) || 0;
    const eightStepSequencesCorrect = Number(params.eightStepSequencesCorrect) || 0;
    const totalCorrect = Number(params.totalCorrect) || 0;
    
    return (
        <View style={localStyles.container}>
            
            <Text style={localStyles.title}>Test Completed</Text>

            {/* Hlavná štatistika */}
            <ScrollView contentContainerStyle={localStyles.statsScroll}>
                <StatMini 
                    label="Total score"
                    value={5.6}
                    percentile={73}
                    max={100}
                />

                {/* Vedľajšie štatistiky */}
                <StatMiniSupplementary label="3-step sequences" value={threeStepSequencesCorrect} whole={2} />
                <StatMiniSupplementary label="4-step sequences" value={fourStepSequencesCorrect} whole={4} />
                <StatMiniSupplementary label="5-step sequences" value={fiveStepSequencesCorrect} whole={4} />
                <StatMiniSupplementary label="6-step sequences" value={sixStepSequencesCorrect} whole={3} />
                <StatMiniSupplementary label="7-step sequences" value={sevenStepSequencesCorrect} whole={3} />
                <StatMiniSupplementary label="8-step sequences" value={eightStepSequencesCorrect} whole={2} />
                <StatMiniSupplementary label="Total correct sequences" value={totalCorrect} whole={18} />
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
        backgroundColor: "#dceeff",
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