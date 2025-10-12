import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Card, Red_Triangle_Card, Green_Stars_Card, Yellow_Pluses_Card, Blue_Circles_Card } from "@/components/Card";

export default function WCST_Screen() {
    // karty do ktorych budem ukladat
    const rows = [
        {
            cards: [
                { value: "A", suit: "♠" },
                { value: "K", suit: "♥" },
            ],
            backgroundColor: "red",
        },
        {
            cards: [
                { value: "10", suit: "♦" },
                { value: "3", suit: "♣" },
            ],
            backgroundColor: "darkorange",
        },
    ];

    // balicek kariet
    const cardPack = {
        cards: [
            { value: "7", suit: "♠" },
        ],
        backgroundColor: "green",
    }

    return (
        <View style={styles.container}>
            <View style={[styles.row, { backgroundColor: "red" }]}>
                <Red_Triangle_Card></Red_Triangle_Card>
                <Green_Stars_Card></Green_Stars_Card>
            </View>

            <View style={[styles.row, { backgroundColor: "darkorange" }]}>
                <Yellow_Pluses_Card></Yellow_Pluses_Card>
                <Blue_Circles_Card></Blue_Circles_Card>
            </View>

             {/* Samostatný tretí riadok */}
            <View style={[styles.row, { backgroundColor: cardPack.backgroundColor }]}>
                {cardPack.cards.map((card, cardIndex) => (
                    <Card
                        key={cardIndex}
                        value={card.value}
                        suit={card.suit}
                    />
                ))}
            </View>
        </View>
    );

    // return (
    //     <View style={styles.container}>
    //         <View style={styles.row}>
    //             {cards.map((c, index) => (
    //                 <Card key={index} value={c.value} suit={c.suit} />
    //             ))}
    //         </View>
    //         <View style={styles.row2}>
    //             {cards2.map((c, index) => (
    //                 <Card key={index} value={c.value} suit={c.suit} />
    //             ))}
    //         </View>
    //         <View style={styles.row3}>
    //             {cards3.map((c, index) => (
    //                 <Card key={index} value={c.value} suit={c.suit} />
    //             ))}
    //         </View>
    //     </View>
    // );
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
        marginVertical: 4,          // odsadenie medzi riadkami
    },
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 50,
        borderRightWidth: 50,
        borderBottomWidth: 100,
        borderBottomColor: 'red',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
    }
});