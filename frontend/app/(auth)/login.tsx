import { Text } from '@/components/Themed';
import axios from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Dimensions, Image, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from "../../assets/styles/auth.styles";

const { height } = Dimensions.get("window");

type LoginPayload = {
    username: string;
    password: string;
}

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

        setLoading(false);

        const login: LoginPayload = {
            username,
            password,
        };

        try {
            await await axios.post("https://bachelor-pi.vercel.app/login", login);

            router.replace("/games");
        } catch (err: any) {

            if (err.response?.data?.message) {
                setLoginError(err.response.data.message)
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
            <View style={[styles.header, {
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
            }]}>
                <Text style={[styles.title, {
                    alignSelf: 'flex-end',
                    marginLeft: '5%',
                    marginBottom: 18,
                }]}>Log In</Text>

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

            <View style={styles.body}>
                <View style={[styles.inputGroup, { marginTop: height * 0.04 }]}>
                    <Text style={styles.label}>Username</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your username"
                        value={username}
                        onChangeText={setUsername}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder='Enter your password'
                        secureTextEntry={true}
                        value={password}
                        onChangeText={setPassword}
                    />

                    {loginError ? (
                        <Text style={localStyles.errorText}>
                            {loginError}
                        </Text>
                    ) : null}
                </View>

                <TouchableOpacity 
                    style={styles.button}
                    onPress={loginUser}
                >
                    <Text style={styles.buttonText}>Log in</Text>
                </TouchableOpacity>

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
        color:  "#1E90FF", 
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
    }
})
