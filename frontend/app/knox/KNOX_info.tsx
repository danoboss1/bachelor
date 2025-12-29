import { router } from "expo-router";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { styles } from "../../assets/styles/mainScreens.styles";

const KNOX_ROUTE = "/knox/KNOX";

const { width, height } = Dimensions.get("window");

export default function KNOXInfoScreen() {
    return (
        <ScrollView contentContainerStyle={localStyles.container}>
            <View>
                <Text>Knox's Cube Test</Text>
            </View>

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
})