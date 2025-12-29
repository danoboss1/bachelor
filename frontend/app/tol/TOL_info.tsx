import { router } from "expo-router";
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { styles } from "../../assets/styles/mainScreens.styles";

const TOL_ROUTE = "/tol/TOL";

const { width, height} = Dimensions.get("window");


export default function TOLInfoScreen() {
    return (
        <ScrollView contentContainerStyle={localStyles.container}>
            <Text style={localStyles.title_info}>🧱 Tower of London (ToL)</Text>

            <Text style={localStyles.section}>
                Move the discs to match the target configuration
            </Text>

            <Text style={localStyles.subtitle}>Peg capacities:</Text>
            <Text style={localStyles.item}>• Long peg: 3 discs</Text>
            <Text style={localStyles.item}>• Medium peg: 2 discs</Text>
            <Text style={localStyles.item}>• Short peg: 1 disc</Text>

            <Text style={localStyles.subtitle}>🎯 Goal</Text>
            <Text style={localStyles.section}>
                Plan the correct order of moves to reach the target using the minimum number of moves.
            </Text>

            <Text style={localStyles.subtitle}>🔄 Game Info</Text>
            <Text style={localStyles.item}>• 24 problems (4–6 move sequences)</Text>
            <Text style={localStyles.item}>• 3 or 4 colored discs depending on difficulty</Text>
            <Text style={localStyles.item}>• Total time limit: 20 minutes</Text>
            <Text style={localStyles.item}>• Time limit per problem: 1 minute</Text>
            <Text style={localStyles.item}>• Test ends after 3 consecutive time-outs</Text>

            <Text style={localStyles.subtitle}>🎮 Controls</Text>
            <Text style={localStyles.section}>
                Tap a disc to pick it up if it is on top of a peg.{"\n"}
                Tap a peg to place the disc. Invalid moves are not allowed.
            </Text>

            <View style={localStyles.separator} />

            <TouchableOpacity
                style={localStyles.button}
                onPress={() => router.push(TOL_ROUTE)}
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
})