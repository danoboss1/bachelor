import { Text } from "@/components/Themed";
import axios from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    Image,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { styles } from "../../assets/styles/auth.styles";
import { saveToken } from "./tokenStorage";

const { height } = Dimensions.get("window");

type LoginPayload = {
    username: string;
    password: string;
};
import { API_BASE_URL } from "@/constants/config";

export default function TabOneScreen() {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [loginError, setLoginError] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [loading, setLoading] = useState(false);

    async function loginUser() {
        setLoginError("");
        setErrorMessage("");

        setLoading(true);

        const login: LoginPayload = {
            username,
            password,
        };

        try {
            const res = await axios.post(
                `${API_BASE_URL}/login`,
                login
            );

            const token = res.data?.token;

            if (!token) {
                setErrorMessage("No token returned from server");
                return;
            }

            await saveToken(token);

            router.replace("/(tabs)/games");
        } catch (err: any) {
            if (err.response?.data?.message) {
                setLoginError(err.response.data.message);
            } else if (err.request) {
                setErrorMessage("Cannot connect to server");
            } else {
                setErrorMessage("Login failed");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.header,
                    {
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    },
                ]}
            >
                <Text
                    style={[
                        styles.title,
                        {
                            alignSelf: "flex-end",
                            marginLeft: "5%",
                            marginBottom: 18,
                        },
                    ]}
                >
                    Log In
                </Text>

                <Image
                    source={require("../../assets/images/brainee.png")}
                    style={{
                        width: 60,
                        height: 60,
                        resizeMode: "contain",
                        alignSelf: "flex-end",
                        marginBottom: 14,
                        marginRight: "5%",
                    }}
                />
            </View>

            <View style={styles.body}>
                <View style={[styles.inputGroup, { marginTop: height * 0.04 }]}>
                    <Text style={styles.label}>Username</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your username"
                        placeholderTextColor="#999"
                        value={username}
                        onChangeText={(text) => {
                            setUsername(text);
                            setLoginError("");
                            setErrorMessage("");
                        }}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your password"
                        placeholderTextColor="#999"
                        secureTextEntry={true}
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            setLoginError("");
                            setErrorMessage("");
                        }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        textContentType="password"
                    />

                    {loginError ? (
                        <Text style={localStyles.errorText}>
                            {loginError}
                        </Text>
                    ) : null}
                </View>

                <TouchableOpacity
                    style={[
                        styles.button,
                        loading && { opacity: 0.6 }
                    ]}
                    onPress={loginUser}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>
                            Log in
                        </Text>
                    )}
                </TouchableOpacity>

                {errorMessage ? (
                    <Text style={localStyles.errorText}>
                        {errorMessage}
                    </Text>
                ) : null}

                <Text style={styles.bottomMessage}>
                    Don't have an account?{" "}
                    <Text
                        style={localStyles.linkText}
                        onPress={() => router.push("/(auth)/signup")}
                    >
                        Sign up
                    </Text>
                </Text>
            </View>
        </View>
    );
}

const localStyles = StyleSheet.create({
    linkText: {
        color: "#1E90FF",
        fontWeight: "600",
        textDecorationLine: "underline",
    },
    errorText: {
        color: "red",
        marginHorizontal: "5%",
        marginTop: 4,
        textAlign: "left",
        fontSize: 12,
        fontWeight: "500",
    },
});
