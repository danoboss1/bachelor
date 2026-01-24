// import React from "react";

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
          imageStyle={{ borderRadius: 16 }} // zaoblenie rohov
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

// tuto musim este spravit aby tie styly boli vsetky responzivne

const localStyles = StyleSheet.create({
  card: {
    height: height * 0.4,
    width: width * 0.9,
    borderRadius: 16,
    marginBottom: 12,
    overflow: "hidden", // veľmi dôležité, aby sa borderRadius aplikoval aj na obrázok
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginHorizontal: width * 0.05,
    marginVertical: height * 0.03,
  },
  imageBackground: {
    flex: 1,
    justifyContent: "flex-end", 
    padding: 16,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontWeight: "bold",
    alignSelf: "flex-start",
    fontSize: 20,
    color: "#000",
    textAlign: "center", 
    marginLeft: width * 0.1,
    fontFamily: "Gagalin",
    marginBottom: height * 0.04,
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
    flexDirection: 'row',
    alignItems: "center",     
    justifyContent: "center",
    backgroundColor: "#FF1E1E",
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.04,
    borderRadius: 10,
    width: width * 0.2,       // tlačidlo bude mať cca 20% šírky obrazovky
    alignSelf: "flex-end", 
  },
});



// const localStyles = StyleSheet.create({
//     header: {
//         fontSize: 24,
//         fontWeight: "bold",
//         textAlign: "center",
//         marginTop: 40,
//         color: "white",
//     },
//     card: {
//         backgroundColor: "#cce5ff",
//         borderRadius: 16,
//         padding: 20,
//         marginBottom: 12,
//         shadowColor: "#000",
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.3,
//         shadowRadius: 4,
//         elevation: 5,
//     },
//     cardTitle: {
//         fontSize: 18,
//         fontWeight: "bold",
//     },
//     cardDescription: {
//         fontSize: 14,
//         color: "#333",
//         marginTop: 4,
//     },
// });