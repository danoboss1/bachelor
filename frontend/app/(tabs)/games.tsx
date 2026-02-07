import { Text, View } from '@/components/Themed';
import { FlatList, StyleSheet } from 'react-native';
import { styles } from "../../assets/styles/mainScreens.styles";
// import { Card, Red_Triangle_Card, Gr } from "@/components/Card";
import { GameCard } from "@/components/GameComponent";

const gamesData = [
    {
        id: "1",
        title: "Wisconsin Card\nSorting Test",
        subtitle: "responding to feedback\nflexibility",
        image: require('../../assets/images/wisconsinCardSortingTestBroskyna.png'),
        path: "/wcst/WCST_info" as const,
    },
    {   
        // takato farba bielej to je #f9f9f9
        // velkost toho obrazku ako funguje skontrolovat
        id: "2",
        title: "Tower of London",
        subtitle: "decision-making\nplanning",
        image: require('../../assets/images/TowerOfLondonBroskyna.png'),
        path: "/tol/TOL_info" as const,
    },
    {
        // #EAF4FF
        // #DCEEFF
        id: "3",
        title: "Knox's Cube\nTest",
        subtitle: "working memory\ninhibition",
        image: require('../../assets/images/knoxsCubeTestBroskyna.png'),
        path: "/knox/KNOX_info" as const,
    },
];



export default function GamesScreen() {
    return (
        <View style={styles.container}>
            {/* vrchna cast pred upravou */}
            <View style={styles.bgTop}>
                <Text style={styles.header}> Hi, John </Text>
                <Text style={styles.subheader}> Let's start practising </Text>
            </View>
            
            {/* spodna cast pred upravou */}
            <View style={styles.bgBottom}>
                <FlatList
                    data={gamesData}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <GameCard
                        title={item.title}
                        subtitle={item.subtitle}
                        image={item.image} 
                        path={item.path}
                        />
                    )}
                />
            </View>

            {/* <Helper></Helper> */}


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