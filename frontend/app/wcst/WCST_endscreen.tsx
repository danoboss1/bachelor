import { StatMini, StatMiniSupplementary } from '@/components/StatsComponent';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from "expo-router";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../assets/styles/mainScreens.styles";

const RETURN_HOME = "/(tabs)/games";

const { width, height } = Dimensions.get("window");

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

    return (
        <LinearGradient
            colors={["#FF8C00", "#FFD700"]} // žltá → oranžová
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.container}
        >
            <View style={localStyles.container}>

                {/* Nadpis */}
                <Text style={localStyles.title}>Test Completed</Text>

                {/* Scroll iba pre štatistiky */}
                <ScrollView contentContainerStyle={localStyles.statsScroll}>
                    {/* Hlavné štatistiky */}
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

                    {/* <Text style={localStyles.subTitle}>Vedľajšie štatistiky</Text> */}
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
        </LinearGradient>
    );
}

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: "#fff",
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
        // marginBottom: 20,
        marginBottom: height * 0.05,
        textAlign: "center",
        // marginTop: height * 0.01,
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
