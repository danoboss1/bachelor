import { Text, View } from '@/components/Themed';
import { FlatList, StyleSheet } from 'react-native';
import { styles } from "../../assets/styles/mainScreens.styles";
// import { Card, Red_Triangle_Card, Gr } from "@/components/Card";
import { GameCard } from "@/components/GameComponent";

const gamesData = [
  { id: "1", title: "Game 1", description: "Description for Game 1" },
  { id: "2", title: "Game 2", description: "Description for Game 2" },
  { id: "3", title: "Game 3", description: "Description for Game 3" },
  { id: "4", title: "Game 4", description: "Description for Game 4" },
  { id: "5", title: "Game 5", description: "Description for Game 5" },
  { id: "6", title: "Game 6", description: "Description for Game 6" },
  { id: "7", title: "Game 7", description: "Description for Game 7" },
  { id: "8", title: "Game 8", description: "Description for Game 8" },
];

// const GameCard = ({ title, description }: {title: string; description: string }) => (
//     <TouchableOpacity style={localStyles.card}>
//         <Text style={localStyles.cardTitle}>{title}</Text>
//         <Text style={localStyles.cardDescription}>{description}</Text>
//     </TouchableOpacity>
// );

export default function GamesScreen() {
    return (
        <View style={styles.container}>
            {/* <View style={styles.background}>
                <View style={styles.bgTop}></View>
                <View style={styles.bgBottom}></View>
            </View> */}

            {/* vrchna cast pred upravou */}
            <View style={styles.bgTop}>
                <Text style={localStyles.header}> Nadpis </Text>
            </View>
            
            {/* spodna cast pred upravou */}
            <View style={styles.bgBottom}>
                <Text> Games </Text>

                <FlatList
                    data = {gamesData}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <GameCard title={item.title} description={item.description} />
                    )}
                    contentContainerStyle={{ padding: 16 }}
                />
            </View>

            {/* <View style={styles.content}>
                <Text>Games</Text>

                <View style={styles.rectangle} />
            </View> */}
        </View>
    )
}


const localStyles = StyleSheet.create({
    header: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 40,
        color: "white",
    },
    card: {
        backgroundColor: "#cce5ff",
        borderRadius: 16,
        padding: 20,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    cardDescription: {
        fontSize: 14,
        color: "#333",
        marginTop: 4,
    },
});