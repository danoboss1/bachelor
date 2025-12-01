import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export const Theme = {
    button: {
        radius:  width * 0.025,
    },

    typography: {
        h1: 28,
        buttonTextWhite: {
        color: "white",
        fontWeight: "bold",
        fontSize: 12,
        textAlign: "center",
        },
    },
}