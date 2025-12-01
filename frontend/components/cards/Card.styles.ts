import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get("window");

export const cardStyles = StyleSheet.create({
    card: {
        width: width * 0.25,
        height: height * 0.2,
        borderRadius: width * 0.02,
        borderWidth: width * 0.003,
        borderColor: "#333",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        shadowColor: "#000",
    },
    row: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: height * 0.003,  
    },
    star: {
        fontSize: width * 0.083,
        color: "green",
        marginHorizontal: width * 0.005,
        lineHeight: width * 0.08,
        textAlignVertical: 'center',
        marginVertical: height * 0.013,
    },
    plus: {
        fontSize: width * 0.115, 
        color: "orange",
        marginHorizontal: width * 0.015,
        fontWeight: "bold",
        lineHeight: width * 0.105,
    },
    circle: {
        width: width * 0.065,
        height: width * 0.065,
        borderRadius: (width * 0.065) / 2, // polovica width/height → kruh
        backgroundColor: "blue",
        marginHorizontal: width * 0.015,
        marginVertical: height * 0.015,
    },  
});