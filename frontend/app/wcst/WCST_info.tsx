import { router } from "expo-router";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../../assets/styles/mainScreens.styles";

const WCST_ROUTE = "/wcst/WCST";

const { width, height } = Dimensions.get("window");


export default function GameInfo() {
    return (
        <ScrollView contentContainerStyle={localStyles.container}>
            <Text style={localStyles.title_info}>🧩 Wisconsin Card Sorting Test (WCST)</Text>

            <Text style={localStyles.section}>
                Sort the cards according to a hidden rule.
            </Text>

            <Text style={localStyles.subtitle}>Each card can be sorted by:</Text>
            <Text style={localStyles.item}>🎨 Color (red, green, blue, yellow)</Text>
            <Text style={localStyles.item}>🔷 Shape (star, cross, triangle, circle)</Text>
            <Text style={localStyles.item}>🔢 Number (1–4 symbols)</Text>

            <Text style={localStyles.subtitle}>🎯 Goal</Text>
            <Text style={localStyles.section}>
                Figure out the current rule using feedback and sort correctly.{"\n"}
                The rule will change without warning — stay flexible!
            </Text>

            <Text style={localStyles.subtitle}>🔄 Game Info</Text>
            <Text style={localStyles.item}>• The test ends after 6 completed categories (10 consecutive correct responses each) or when all 128 cards have been used.</Text>
            <Text style={localStyles.item}>• Time limit: 20 minutes</Text>

            <Text style={localStyles.subtitle}>🎮 Controls</Text>
            <Text style={localStyles.section}>
                Tap one of the 4 cards at the top of the screen to place the current card.
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
        padding: width * 0.052,
        paddingBottom: height * 0.05,
        backgroundColor: "#fff",
        justifyContent: "center",
    },
    title_info: {
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
        marginVertical: 24,
        height: StyleSheet.hairlineWidth,
        backgroundColor: "#ccc",
    },
    button: {
        flexDirection: "row",
        alignItems: "center",     
        justifyContent: "center",
        backgroundColor: "#0E8A39",
        width: width * 0.4,       
        alignSelf: "center", 
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        minHeight: 48,
        minWidth: 60,

        elevation: 3, // Android shadow

        shadowColor: "#000", // iOS shadow
        shadowOpacity: 0.15,
        shadowRadius: 4,
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },
});