import { router } from "expo-router";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { styles } from "../../assets/styles/mainScreens.styles";

const KNOX_ROUTE = "/knox/KNOX";

const { width, height } = Dimensions.get("window");

export default function KNOXInfoScreen() {
    return (
        <ScrollView contentContainerStyle={localStyles.container}>
            <Text style={localStyles.title_info}>🔷 Knox's Cube Test (KCT)</Text>

            <Text style={localStyles.subtitle}>
                Memorize and reproduce a visual sequence of cubes.
            </Text>

            <Text style={localStyles.subtitle}>🎯 Goal</Text>
            <Text style={localStyles.section}>
                Observe the order in which the cubes light up and tap them in the exact same sequence.{"\n"}
            </Text>

            <Text style={localStyles.subtitle}>🔄 Game Info</Text>
            <Text style={localStyles.item}>• The test consists of 18 sequences, ranging from 2-step to 7-step sequences</Text>
            <Text style={localStyles.item}>• The test ends after completing all sequences</Text>

            <Text style={localStyles.subtitle}>🎮 Controls</Text>
            <Text style={localStyles.section}>
                Watch the cubes light up, then tap the cubes with your finger in the same order as presented.
            </Text>

            <View style={localStyles.separator} />

            <TouchableOpacity
                style={localStyles.button}
                onPress={() => router.push(KNOX_ROUTE)}
            >
                <Text style={styles.buttonTextWhite}> Start Test </Text>
            </TouchableOpacity>

        </ScrollView>
    );
}

const localStyles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: width * 0.052,
        backgroundColor: "#fff",
        justifyContent: "center",
    },
    separator: {
        marginVertical: height * 0.027,
        height: StyleSheet.hairlineWidth,
        backgroundColor: "#ccc",
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0E8A39",
        paddingVertical: height * 0.02,
        borderRadius: width * 0.025,
        width: width * 0.4,       
        alignSelf: "center", 
    },
    title_info: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    section: {
        fontSize: 16,
        marginTop: 5,
    },
    subtitle: {
        marginTop: 15,
        fontSize: 18,
        fontWeight: "600",
    },
    item: {
        fontSize: 16,
        marginLeft: 10,
        marginTop: 4,
    },
});
