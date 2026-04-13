import { useRouter } from "expo-router";
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { styles } from "../../assets/styles/mainScreens.styles";
import { GameCard } from "@/components/GameComponent";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { getToken } from "../(auth)/tokenStorage";
import axios from "axios";
import { API_BASE_URL } from "@/constants/config";

const API_URL = `${API_BASE_URL}`;

type TokenPayload = {
    id: number;
    username: string;
    exp: number;
};

const gamesData = [
    {
        id: "1",
        title: "Wisconsin Card\nSorting Test",
        subtitle: "responding to feedback\nflexibility",
        image: require('../../assets/images/wisconsinCardSortingTestBroskyna.png'),
        path: "/wcst/WCST_info" as const,
    },
    {   
        id: "2",
        title: "Tower of London",
        subtitle: "decision-making\nplanning",
        image: require('../../assets/images/TowerOfLondonBroskyna.png'),
        path: "/tol/TOL_info" as const,
    },
    {
        id: "3",
        title: "Knox's Cube\nTest",
        subtitle: "working memory\ninhibition",
        image: require('../../assets/images/knoxsCubeTestBroskyna.png'),
        path: "/knox/KNOX_info" as const,
    },
];



export default function GamesScreen() {
    const router = useRouter();

    const [userId, setUserId] = useState<number | null>(null);

    const [username, setUsername] = useState("");

    const [generalError, setGeneralError] = useState("");

    const [loadingUser, setLoadingUser] = useState(true);

    useEffect(() => {
        async function loadUserFromToken() {
            try {
                const token = await getToken();

                if (!token) {
                    setGeneralError("User is not logged in");
                    setLoadingUser(false);
                    router.replace("/(auth)/login");
                    return;
                }

                const decoded = jwtDecode<TokenPayload>(token);
                setUserId(decoded.id);
            } catch (error) {
                console.log("Token decode error:", error);
                setGeneralError("Failed to load user session");
                setLoadingUser(false);
            }
        }

        loadUserFromToken();
    }, []);

    useEffect(() => {
        if (!userId) return;

        async function fetchUser() {
            try {
                setLoadingUser(true);
                setGeneralError("");

                const res = await axios.get(`${API_URL}/users/${userId}`);
                setUsername(res.data.username ?? "");
            } catch (error) {
                console.log("Fetch user error:", error);
                setGeneralError("Failed to load user data");
            } finally {
                setLoadingUser(false);
            }
        }

        fetchUser();
    }, [userId]);

    return (
        <View style={styles.container}>
            {/* vrchna cast pred upravou */}
            <View style={[styles.bgTop, {
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
            }]}>
                <View>
                    <Text style={styles.header}>Hi, {username.trim() || "Username"}</Text>
                    <Text style={styles.subheader}> Let's start practising </Text>
                </View>

                <Image
                    source={require('../../assets/images/brainee.png')}
                    style={{
                        width: 60,
                        height: 60,
                        resizeMode: 'contain',
                        alignSelf: "flex-end",
                        marginBottom: 14,
                        marginRight: '5%',
                    }}
                />
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