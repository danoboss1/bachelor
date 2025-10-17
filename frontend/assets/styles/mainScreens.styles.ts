import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    // background layer
    background: {
        flex: 1,
        position: "absolute",
    },
    bgTop: {
        flex: 1,
        backgroundColor: "lightblue",
    },
    bgBottom: {
        flex: 3,
        backgroundColor: "white",
    },

    // content layer
    content: {
        flex: 1,
        // ...StyleSheet.absoluteFillObject, // umožní umiestniť obsah nad background
        justifyContent: 'center', // centrovanie vertikálne
        alignItems: 'center',     // centrovanie horizontálne
        // width: "100%",
        // height: "100%",
        // alignItems: "center",
        // justifyContent: "center",
    },
    rectangle: {
        width: "80%",
        aspectRatio: 2,
        backgroundColor: "green",
        borderRadius: "16",
        position: "absolute",
        top: "17%",
    },
});