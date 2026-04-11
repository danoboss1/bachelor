import { router } from "expo-router";
import React from "react";
import { Dimensions, ImageBackground, ImageSourcePropType, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { styles } from "../assets/styles/mainScreens.styles";

const { width, height } = Dimensions.get("window");

type GameCardProps = {
    title: string;
    subtitle?: string;
    image?: ImageSourcePropType;
    path: "/wcst/WCST_info" | "/tol/TOL_info" | "/knox/KNOX_info";
}

export function GameCard({ image, title, subtitle, path }: GameCardProps) {
    return (
        <View style={localStyles.card}>
            {image ? (
                <ImageBackground
                    source={image}
                    style={localStyles.imageBackground}
                    imageStyle={{ borderRadius: 16 }}
                >
                    <Text style={localStyles.cardSubtitle}>{subtitle}</Text>

                    <View style={localStyles.rowContainer}>
                        <Text style={localStyles.cardTitle}>{title}</Text>
                        {/* <Text style={localStyles.cardDescription}>{description}</Text> */}
                        <TouchableOpacity
                            style={localStyles.button}
                            onPress={() => router.push(path)}
                        >
                            <Text style={styles.buttonTextWhite}> Play </Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            ) : (
                <>
                    <View style={localStyles.rowContainer}>
                        <Text style={localStyles.cardTitle}>{title}</Text>
                        {/* <Text style={localStyles.cardDescription}>{description}</Text> */}
                        <TouchableOpacity
                            style={localStyles.button}
                            onPress={() => router.push(path)}
                        >
                            <Text style={styles.buttonTextWhite}> Play </Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
}

const localStyles = StyleSheet.create({
    card: {
        height: height * 0.4,
        width: width * 0.9,
        borderRadius: 16,
        marginBottom: 16,
        marginTop: 20,
        overflow: "hidden",
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        marginHorizontal: width * 0.05,
    },
    imageBackground: {
        flex: 1,
        justifyContent: "flex-end",
        padding: 16,
    },
    rowContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    cardTitle: {
        fontWeight: "bold",
        alignSelf: "flex-start",
        fontSize: 20,
        color: "#000",
        textAlign: "center",
        marginLeft: 24,
        marginBottom: 30,
        fontFamily: "Gagalin",
    },
    cardSubtitle: {
        position: "absolute",
        top: 4,
        right: 16,
        alignSelf: "flex-start",
        fontWeight: "bold",
        fontSize: 16,
        color: "#000",
        fontFamily: "Gagalin",
        textAlign: "right",
    },
    cardDescription: {
        fontSize: 14,
        color: "white",
        marginTop: 4,
    },
    button: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FF1E1E",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 10,
        minHeight: 48,
        minWidth: 60,
        alignSelf: "flex-end",
    },
});