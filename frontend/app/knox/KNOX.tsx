import { Square } from "@/components/knox/KnoxComponents";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function KNOX_Screen() {
    return (
        <View style={localStyles.container}> 

            <View style={localStyles.timer} />

            <View style={localStyles.infoBox} />

            <View style={localStyles.squaresBox}>
                <Text> Tu budu stvorce </Text>
                <Square></Square>
            </View>

            <View style={localStyles.footer} />

        </View>
    );
} 

const localStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    timer: {
        flex: 1,
    },
    infoBox: {
        flex: 2,
    },
    squaresBox: {
        flex: 4,
    },
    footer: {
        flex: 1,
    },
})