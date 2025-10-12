import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/Colors";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: 20,
        justifyContent: "center",
    },
    input: {
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderRadius: 12,
        borderColor: COLORS.border,
        fontSize: 16,
        color: COLORS.text,
        padding: 15,
        marginBottom: 16,
    },
});