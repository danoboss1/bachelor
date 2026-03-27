import { router } from "expo-router";
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { styles } from "../../assets/styles/mainScreens.styles";

const TOL_ROUTE = "/tol/TOL";

const { width, height } = Dimensions.get("window");


export default function TOLInfoScreen() {
    return (
        <ScrollView contentContainerStyle={localStyles.container}>
            <Text style={localStyles.title_info}>🧱 Tower of London (ToL)</Text>

            <Text style={localStyles.section}>
                Arrange the discs to match the target configuration.
            </Text>

            <Text style={localStyles.subtitle}>Peg capacities:</Text>
            <Text style={localStyles.item}>• Long peg: 3 discs</Text>
            <Text style={localStyles.item}>• Medium peg: 2 discs</Text>
            <Text style={localStyles.item}>• Short peg: 1 disc</Text>

            <Text style={localStyles.subtitle}>🎯 Goal</Text>
            <Text style={localStyles.section}>
                Plan ahead the moves to reach the target using the minimum number of moves.
            </Text>

            <Text style={localStyles.subtitle}>🔄 Game Info</Text>
            <Text style={localStyles.item}>• 24 problems (4–6 move sequences)</Text>
            <Text style={localStyles.item}>• 3 colored discs</Text>
            <Text style={localStyles.item}>• Test ends after 3 consecutive time-outs</Text>
            <Text style={localStyles.item}>• The test ends early if you fail all problems within a level (for example, all 4-move tasks)</Text>

            <Text style={localStyles.subtitle}>🎮 Controls</Text>
            <Text style={localStyles.section}>
                Tap a top disc to pick it up, then tap a peg to place it. 
                Move one disc at a time, and invalid moves are blocked.
            </Text>

            <View style={localStyles.separator} />

            <TouchableOpacity
                style={localStyles.button}
                onPress={() => router.replace(TOL_ROUTE)}
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