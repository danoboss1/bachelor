import { router } from "expo-router";
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { styles } from "../../assets/styles/mainScreens.styles";

const TOL_ROUTE = "/tol/TOL";

const { width, height} = Dimensions.get("window");


export default function TOLInfoScreen() {
    return (
        <ScrollView contentContainerStyle={localStyles.container}>
            <View>
                <Text>Tower of London Screen</Text>
            </View>

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
})