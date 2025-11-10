import { Blue_Circles_Card, Card, Green_Stars_Card, Red_Triangle_Card, Yellow_Pluses_Card } from "@/components/Card";
import React from "react";
import { Animated, Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";

const { width, height } = Dimensions.get("window");


export default function WCST_Screen() {
    // const [cardPack, setCardPack] = React.useState([{ value: "7", suit: "♠" }]);
    const [cardPack, setCardPack] = React.useState([
        { value: "7", suit: "♠" },
        { value: "K", suit: "♥" },
        { value: "3", suit: "♦" },
        { value: "A", suit: "♣" },
    ]);
    
    const redTriangleRef = React.useRef<View>(null);
    const greenStarsRef = React.useRef<View>(null);
    const yellowPlusesRef = React.useRef<View>(null);
    const blueCirclesRef = React.useRef<View>(null);

    const packRef = React.useRef<View>(null);

    const targetPos = React.useRef({ x: 0, y: 0 }).current;

    const animPos = React.useRef(new Animated.ValueXY({ x: 0, y: 0})).current;
    // karty do ktorych budem ukladat
    React.useEffect(() => {
        // animPos.setValue({ x: rowCenterX - (width * 0.25 / 2), y: (4 * rowCenterY) });
        packRef.current?.measure((fx, fy, w, h, px, py) => {
            animPos.setValue({ x: px, y: py });
        });
        redTriangleRef.current?.measure((fx, fy, w, h, px, py) => {
            targetPos.x = px;
            targetPos.y = py;
        });
    });

    const moveCard = () => {
        if (cardPack.length === 0 ) return;

        const card = cardPack[0];

        Animated.timing(animPos, {
            toValue: { x: targetPos.x, y: targetPos.y },
            duration: 1000,
            useNativeDriver: false,
        }).start(() => {
            console.log("Animated finished");
        });
    };

    const moveCardTo = (targetRef: React.RefObject<View | null>) => {
        targetRef.current?.measure((fx, fy, w, h, px, py) => {
            Animated.timing(animPos, {
            toValue: { x: px, y: py },
            duration: 1000,
            useNativeDriver: false,
            }).start(() => {
                console.log("Animated finished");

                 setCardPack(prevPack => prevPack.slice(1));

                // reset animPos pre ďalšiu kartu
                packRef.current?.measure((fx, fy, w, h, px, py) => {
                    animPos.setValue({ x: px, y: py });
                });
            });
        })
    }

    return (
        <View style={styles.container}>
            <View style={[styles.row, { backgroundColor: "red" }]}>
                <TouchableOpacity
                    ref={redTriangleRef}
                    activeOpacity={0.8}
                    onPress={() => moveCardTo(redTriangleRef)}
                >
                    <Red_Triangle_Card />
                </TouchableOpacity>
                <TouchableOpacity
                    ref={greenStarsRef}
                    activeOpacity={0.8}
                    onPress={() => moveCardTo(greenStarsRef)}
                >
                    <Green_Stars_Card />
                </TouchableOpacity>
            </View>

            <View style={[styles.row, { backgroundColor: "darkorange" }]}>
                <TouchableOpacity
                    ref={yellowPlusesRef}
                    activeOpacity={0.8}
                    onPress={() => moveCardTo(yellowPlusesRef)}
                >
                    <Yellow_Pluses_Card />
                </TouchableOpacity>
                <TouchableOpacity
                    ref={blueCirclesRef}
                    activeOpacity={0.8}
                    onPress={() => moveCardTo(blueCirclesRef)}
                >
                    <Blue_Circles_Card />
                </TouchableOpacity>
            </View>

            <View style={[styles.row, { backgroundColor: "green" }]}>
                <View
                    ref={packRef}
                >
                    <Card value={cardPack[0].value} suit={cardPack[0].suit} />
                </View>
            </View>
            {/* Samostatný tretí riadok */}
            <Animated.View
                // style={[styles.row, { backgroundColor: "green" }]}
                style={{
                    position: "absolute",
                    left: animPos.x,
                    top: animPos.y,
                }}
            >
                {cardPack.length > 0 && <Card value={cardPack[0].value} suit={cardPack[0].suit} />}
            </Animated.View>

            {/* <Animated.View>
                style=
                <Card value={cardPack[0].value} suit={cardPack[0].suit} />
            </Animated.View> */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    row: {
        flexDirection: "row",
        width: "100%",
        flex: 1,
        alignItems: "center",       // vertikálne zarovnanie kariet
        justifyContent: "center",   // horizontálne zarovnanie kariet
        gap: 20,
    },
});