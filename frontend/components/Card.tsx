import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

const { width, height } = Dimensions.get("window");

interface CardProps {
    value: string;    // napr. "A", "K", "10"
    suit: string;     // napr. "♥", "♠", "♦", "♣"
}

export function Card({ value, suit }: CardProps) {
    return (
        <View style={styles.packCard}>
            <Text style={styles.text}>{value}{suit}</Text>
        </View>
    );
}


export function Red_Triangle_Card() { 
    const [cardSize, setCardSize] = React.useState({ width: 0, height: 0});
    return (
        <View
            style={styles.card}
            onLayout={(event) => {
                const { width, height } = event.nativeEvent.layout;
                setCardSize({ width, height });
            }}
        >
            <View
                style={{
                    width: 0,
                    height: 0,
                    borderLeftWidth: cardSize.width * 0.15,
                    borderRightWidth: cardSize.width * 0.15,
                    borderBottomWidth: cardSize.height * 0.15,
                    borderBottomColor: 'red',
                    borderLeftColor: 'transparent',
                    borderRightColor: 'transparent',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: [
                        { translateX: -cardSize.width * 0.15 },
                        { translateY: -cardSize.height * 0.075 },
                    ],
                }} 
            /> 
        </View>
    );
}

export function Green_Stars_Card() {
    return (
        <View style={styles.card}>
            <View style={styles.starsContainer}>
                <Text style={styles.star}>★</Text>
                <Text style={styles.star}>★</Text>
            </View>
        </View>
    )
}

export function Yellow_Pluses_Card() {
    return (
        <View style={styles.card}>
            <View style={styles.row}>
                <Text style={styles.plus}>+</Text>
                <Text style={styles.plus}>+</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.plus}>+</Text>
            </View>
        </View>
    );
}

export function Blue_Circles_Card() {
    return (
        <View style={styles.card}>
            <View style={styles.row}>
                <Text style={styles.circle}></Text>
                <Text style={styles.circle}></Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.circle}></Text>
                <Text style={styles.circle}></Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    packCard: {
        width: width * 0.25,
        height: height * 0.2,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#333",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        shadowColor: "#000",
        // marginTop: (height / 6) - height * 0.1,
    },
    card: {
        width: width * 0.25,
        height: height * 0.2,
        // width: "25%",
        // height: "70%",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#333",
        alignItems: "center",
        justifyContent: "center",
        // margin: 5,
        backgroundColor: "white",
        shadowColor: "#000",
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.3,
        // shadowRadius: 2,
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
    },
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 15,
        borderBottomColor: 'red',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -10 }, { translateY: -7.5 }],
    },
    starsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    star: {
        fontSize: 32,
        color: "green",
        marginHorizontal: 2,
    },
    row: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 2,  
    },
    plus: {
        fontSize: 45,
        color: "orange",
        marginHorizontal: 6,
        fontWeight: "bold",
        lineHeight: 40,
    },
    circle: {
        width: 24,
        height: 24,
        borderRadius: 12, // polovica width/height → kruh
        backgroundColor: "blue",
        marginHorizontal: 6,
        marginVertical: 10,
    },
    
});