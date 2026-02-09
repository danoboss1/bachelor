import { Dimensions, StyleSheet } from "react-native";
import { COLORS } from "../../constants/Colors";

const { height } = Dimensions.get("window");

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: "center",
        // paddingHorizontal: "5%",
    },
    input: {
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderRadius: 12,
        borderColor: COLORS.border,
        fontSize: 16,
        color: COLORS.text,
        padding: 15,
        // paddingHorizontal: "15%",
        // toto budem chciet dat na tie prvy asi nie na ten text
    },
    header: {
        backgroundColor: COLORS.secondary_background,
        // backgroundColor: "#ffd6a5",
    },
    body: {
        flex: 3,
        backgroundColor: "white",
    },
    title: {
        fontSize: 35,
        fontWeight: "800",
    },
    label: {
        fontSize: 14,
        fontWeight: "500",
        marginBottom: 5,
        color: "#333",
        marginHorizontal: "5%",
    },
    button: {
        backgroundColor: COLORS.primary,
        borderRadius: 12,
        padding: 16,
        alignItems: "center",
        marginHorizontal: "5%",
        marginTop: height * 0.02,
        marginBottom: 20,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: "600",
    },
    bottomMessage: {
        textAlign: "center",
        marginTop: height * 0.05,
    },
    inputGroup: {
        marginHorizontal: "5%",
        marginTop: height * 0.02,
        // backgroundColor: "white",
    }
});