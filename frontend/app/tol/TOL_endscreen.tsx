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

    /*
    CATEGORY LOGIC
    */
    
    function getCategoryIndex(totalScore: number) {
        if (totalScore <= 3) return 0;
        if (totalScore <= 5) return 1;
        if (totalScore <= 8) return 2;
        if (totalScore <= 11) return 3;
        if (totalScore > 11) return 4;

        return 0;
    }

    function getCategoryInterpretation(totalScore: number) {
        const index = getCategoryIndex(totalScore);

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

    const labels = [
        "SEVERE\n0-3 points",
        "POOR\n4-5 points",
        "AVERAGE\n6-8 points",
        "GOOD\n9-11 points",
        "EXCELLENT\n12+ points"
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
                                        ? segmentColors[index] // iba aktuálna kategória svieti
                                        : inactiveColor,       // ostatné tmavosivé
                                    borderRightWidth: index < labels.length - 1 ? 1 : 0,
                                    borderRightColor: "#999" // tenká čiarka medzi segmentmi
                                }
                            ]}
                        >
                            <Text style={[
                                localStyles.segmentText,
                                { color: categoryIndex === 2 && index === 2 ? "#333" : "white" }
                                // { color: index === 2 ? "black" : "white" } // žltý segment čitateľný
                            ]}>
                                {label}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* RESULT TEXT */}

                <View style={localStyles.resultContainer}>

                    <Text style={localStyles.resultText}>
                        Total score: {totalScore}
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
    // container: {
    //     flex: 1,
    //     paddingTop: height * 0.026,
    //     alignItems: "center",
    //     justifyContent: "space-between",
    //     // backgroundColor: "#dceeff",
    //     // backgroundColor: "#f9f9f9",
    //     backgroundColor: "#d6c7b9",
    // },
    title: {
        fontSize: Theme.typography.h1,
        fontWeight: "bold",
        marginTop: 20,
    },
    titleContainer: {
        alignItems: "center",  // centrovanie nadpisu horizontálne
        marginBottom: 16,    
    },
    // title: {
    //     fontSize: Theme.typography.h1,
    //     fontWeight: "bold",
    //     color: "#000",
    //     marginBottom: height * 0.03,
    //     textAlign: "center",
    //     marginTop: height * 0.04,
    // },
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
        justifyContent: "center",  // toto je dôležité
        gap: 12, 
    },
    button: {
        // flex: 1,
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