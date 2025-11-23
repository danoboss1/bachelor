import { router } from "expo-router";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../assets/styles/mainScreens.styles";

const WCST_ROUTE = "/wcst/WCST";

const { width, height } = Dimensions.get("window");

export default function GameInfo() {
    return (
        <ScrollView contentContainerStyle={localStyles.container}>
            <Text style={localStyles.title}>🧩 Wisconsin Card Sorting Test (WCST)</Text>

            <Text style={localStyles.section}>
                Sort the cards according to a hidden rule.
            </Text>

            <Text style={localStyles.subtitle}>Each card can be sorted by:</Text>
            <Text style={localStyles.item}>🎨 Color (red, green, blue, yellow)</Text>
            <Text style={localStyles.item}>🔷 Shape (star, cross, triangle, circle)</Text>
            <Text style={localStyles.item}>🔢 Number (1–4 symbols)</Text>

            <Text style={localStyles.subtitle}>🎯 Goal</Text>
            <Text style={localStyles.section}>
                Figure out the current rule and sort correctly.{"\n"}
                The rule will change without warning — stay flexible!
            </Text>

            <Text style={localStyles.subtitle}>🔄 Game Info</Text>
            <Text style={localStyles.item}>• The test ends after 6 completed categories (10 consecutive correct responses each) or when all 128 cards have been used.</Text>
            <Text style={localStyles.item}>• Time limit: 20 minutes</Text>

            <Text style={localStyles.subtitle}>🎮 Controls</Text>
            <Text style={localStyles.section}>
                Tap one of the 4 cards to choose where to place the current card.
            </Text>

            <View style={localStyles.separator} />

            <TouchableOpacity 
                style={localStyles.button}
                onPress={() => router.push(WCST_ROUTE)}
            >
                <Text style={styles.buttonTextWhite}> Start Test </Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const localStyles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: "#fff",
        justifyContent: "center",
        // alignItems: "center",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    subtitle: {
        marginTop: 15,
        fontSize: 18,
        fontWeight: "600",
    },
    section: {
        fontSize: 16,
        marginTop: 5,
    },
    item: {
        fontSize: 16,
        marginLeft: 10,
        marginTop: 4,
    },
    separator: {
        marginVertical: 20,
        height: 1,
        backgroundColor: "#ccc",
    },
    ready: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
    button: {
        flexDirection: 'row',
        alignItems: "center",     
        justifyContent: "center",
        backgroundColor: "#0E8A39",
        paddingVertical: height * 0.02,
        // paddingHorizontal: width * 0.04,
        borderRadius: 10,
        width: width * 0.4,       // tlačidlo bude mať cca 20% šírky obrazovky
        alignSelf: "center", 
    },
});