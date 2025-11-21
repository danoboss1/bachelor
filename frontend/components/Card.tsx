import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";

const { width, height } = Dimensions.get("window");


interface AllCardProps {
    color:"red" | "green" | "orange" | "blue";
    shape: "triangle" | "star" | "plus" | "circle";
    count: number;
}


export function AllCard({ color, shape, count }: AllCardProps) {
  // State pre rozmery karty
  const [cardSize, setCardSize] = React.useState({ width: 0, height: 0 });

  // Funkcia, ktorá vráti jeden tvar podľa typu a farby
  const renderShape = () => {
    switch (shape) {
      case "triangle":
        return (
          <View
            style={{
              width: 0,
              height: 0,
              borderLeftWidth: cardSize.width * 0.15,
              borderRightWidth: cardSize.width * 0.15,
              borderBottomWidth: cardSize.height * 0.15,
              borderBottomColor: color,
              borderLeftColor: "transparent",
              borderRightColor: "transparent",
              margin: 2,
              marginHorizontal: 6,
              marginVertical: 10,
            }}
          />
        );
      case "star":
        return (
          <Text 
            style={{ 
              fontSize: 32, 
              color: color, 
              marginHorizontal: 2,
              lineHeight: 28, // rovnaké ako fontSize
              textAlignVertical: 'center',
              marginVertical: height * 0.013,
            }}
          >
            ★
          </Text>
        );
      case "plus":
        return (
          <Text
            style={{
              fontSize: 45,
              marginHorizontal: width * 0.015,
              fontWeight: "bold",
              lineHeight: 40,
              color: color,
            }}
          >
            +
          </Text>
        );
      case "circle":
        return (
          <View
            style={{
              width: width * 0.065,
              height: width * 0.065,
              borderRadius: (width * 0.065) / 2, // polovica width/height → kruh
              marginHorizontal: width * 0.015,
              marginVertical: height * 0.015,
              backgroundColor: color,
            }}
          />
        );
    }
  };

  // Pole tvarov podľa počtu (count)
  const shapesArray = Array.from({ length: count }, (_, i) => (
    <React.Fragment key={i}>{renderShape()}</React.Fragment>
  ));

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
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {shapesArray}
      </View>
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
            <View style={styles.row}>
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
        borderRadius: width * 0.02,
        borderWidth: width * 0.003,
        borderColor: "#333",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        shadowColor: "#000",
    },
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
    // triangle: {
    //     width: 0,
    //     height: 0,
    //     backgroundColor: 'transparent',
    //     borderStyle: 'solid',
    //     borderLeftWidth: 10,
    //     borderRightWidth: 10,
    //     borderBottomWidth: 15,
    //     borderBottomColor: 'red',
    //     borderLeftColor: 'transparent',
    //     borderRightColor: 'transparent',
    //     position: 'absolute',
    //     top: '50%',
    //     left: '50%',
    //     transform: [{ translateX: -10 }, { translateY: -7.5 }],
    // },
    star: {
        fontSize: width * 0.083,
        color: "green",
        marginHorizontal: width * 0.005,
        lineHeight: width * 0.08,
        textAlignVertical: 'center',
        marginVertical: height * 0.013,
    },
    row: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: height * 0.003,  
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