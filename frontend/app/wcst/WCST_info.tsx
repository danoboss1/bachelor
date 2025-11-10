import { StyleSheet, Text, View } from "react-native";

export default function GameInfo() {
    return (
        <View style={localStyles.center}>
            <Text> Game Info Screen </Text>
        </View>
    )
}

const localStyles = StyleSheet.create({
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});