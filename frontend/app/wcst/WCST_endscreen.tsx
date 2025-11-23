import { StatMini, StatMiniSupplementary } from '@/components/StatsComponent';
import { router, useLocalSearchParams } from "expo-router";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../assets/styles/mainScreens.styles";

const RETURN_HOME = "/(tabs)/games";

const { width, height } = Dimensions.get("window");

export default function WCST_ENDSCREEN() {
    const params = useLocalSearchParams<{ trialsAdministered?: string }>();
    const trials = Number(params.trialsAdministered) || 0;

    return (
        <View style={localStyles.container}>

            {/* Nadpis */}
            <Text style={localStyles.title}>Test Completed</Text>

            {/* Scroll iba pre štatistiky */}
            <ScrollView contentContainerStyle={localStyles.statsScroll}>
                {/* Hlavné štatistiky */}
                <StatMini 
                    label="Total number of trials administered" 
                    value={trials} 
                    max={128} 
                />
                <StatMini 
                    label="Percentage of perseverative responses" 
                    value={12} 
                    max={100} 
                />
                <StatMini 
                    label="Percentage of perseverative errors" 
                    value={9} 
                    max={100} 
                />
                <StatMini 
                    label="Percentage of non-perseverative errors" 
                    value={6} 
                    max={100} 
                />

                {/* <Text style={localStyles.subTitle}>Vedľajšie štatistiky</Text> */}
                <View style={localStyles.separator} />

                {/* Vedľajšie štatistiky */}
                <StatMiniSupplementary label="Number of categories completed" value={5} />
                <StatMiniSupplementary label="Correct responses" value={60} />
                <StatMiniSupplementary label="Errors" value={15} />
                <StatMiniSupplementary label="Percentage of errors" value="20%" />
                <StatMiniSupplementary label="Perseverative responses" value={10} />
                <StatMiniSupplementary label="Perseverative errors" value={8} />
                <StatMiniSupplementary label="Non-perseverative errors" value={7} />
                <StatMiniSupplementary label="Trials to complete first category" value={12} />
                <StatMiniSupplementary label="Failure to maintain set" value={1} />
            </ScrollView>

            {/* Tlačidlá stále viditeľné */}
            <View style={localStyles.buttonContainer}>
                <TouchableOpacity 
                    style={[localStyles.button, { backgroundColor: "#0E8A39" }]}
                    onPress={() => router.push(RETURN_HOME)}
                >
                    <Text style={styles.buttonTextWhite}>Return Home</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[localStyles.button, { backgroundColor: "#1E90FF" }]}
                    onPress={() => router.replace("/wcst/WCST_info")}
                >
                    <Text style={styles.buttonTextWhite}>Play Again</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 20,
        alignItems: "center",
        justifyContent: "space-between",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#000",
        marginBottom: height * 0.03,
        textAlign: "center",
        marginTop: height * 0.04,
    },
    subTitle: {
        fontSize: 22,
        fontWeight: "600",
        color: "#333",
        marginVertical: 15,
        textAlign: "center",
    },
    statsScroll: {
        width: "100%",
        // paddingHorizontal: 20,
        // paddingBottom: 20,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        // width: width * 0.9,
        marginBottom: 20,
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        alignItems: "center",     
        justifyContent: "center",
        paddingVertical: height * 0.02,
        borderRadius: 10,
        marginHorizontal: 5,
    },
    separator: {
        marginVertical: 20,
        height: 1,
        backgroundColor: "#ccc",
        marginHorizontal: width * 0.05,
        width: width * 0.9,
    },
});
