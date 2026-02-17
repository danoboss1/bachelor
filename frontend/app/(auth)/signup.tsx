import axios from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from "../../assets/styles/auth.styles";

const { height } = Dimensions.get("window");

type RegisterPayload = {
    username: string;
    password: string;
}

export default function TabOneScreen() {
    const router = useRouter();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const [errorMessage, setErrorMessage] = useState("");

    const [loading, setLoading] = useState(false);

    async function registerUser() {
        setUsernameError("");
        setPasswordError("");
        setErrorMessage("");
        
        setLoading(true);

        const registration: RegisterPayload = {
            username,
            password,
        };

        try {
            await axios.post("https://bachelor-pi.vercel.app/register", registration);

            router.push("/(auth)/login");
        } catch (err: any) {

            if (err.response?.data?.errors) {
                const errors = err.response.data.errors;

                if (errors.username) {
                    setUsernameError(errors.username);
                }

                if (errors.password) {
                    setPasswordError(errors.password);
                }
            
            // toto by som si mal vyskusat nejako na-mockovat
            } else if (err.request) {
                setErrorMessage("Cannot connect to server");
            } else {
                setErrorMessage("Registration failed");
            }

            // console.error("Registration error", err);

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
                // justifyContent: 'flex-end',  // zarovná obsah dole
                // alignItems: 'flex-start',    // zarovná obsah doľava
                // marginLeft: 16,              // odsadenie zľava
                // marginBottom: 16,            // odsadenie zospodu
            }]}>
                <Text style={[styles.title, {
                    alignSelf: 'flex-start',
                    marginTop: 'auto',
                    marginLeft: '5%',
                    marginBottom: '5%',
                }]}>Sign Up</Text>

                <Image
                    source={require('../../assets/images/brainee.png')}
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

                <View style={[styles.inputGroup, { marginTop: 48 }]}>
                    <Text style={localStyles.floatingLabel}>Username</Text>
                    <TextInput
                        style={styles.input}
                        // placeholder="Enter your username"
                        value={username}
                        onChangeText={(text) => {
                            setUsername(text);
                            setUsernameError("");
                        }}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />

                    {usernameError ? (
                        <Text style={localStyles.errorText}>
                            {usernameError}
                        </Text>
                    ) : null}

                </View>

                <View style={[styles.inputGroup, { marginTop: 32 }]}>
                    <Text style={localStyles.floatingLabel}>Password</Text>
                    <TextInput
                        style={styles.input}
                        // placeholder="Enter your password"
                        secureTextEntry={true}
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            setPasswordError("");
                        }}
                        autoCapitalize="none"
                        autoCorrect={false}
                        textContentType="password"
                    />

                    {passwordError ? (
                        <Text style={localStyles.errorText}>
                            {passwordError}
                        </Text>
                    ) : null}
                </View>

                <TouchableOpacity
                    style={[
                        styles.button,
                        loading && { opacity: 0.6 }
                    ]}
                    onPress={registerUser}
                    disabled={loading}
                >   
                {/* tiez */}
                    { loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>
                            Sign up
                        </Text>
                    )}
                </TouchableOpacity>

                {errorMessage ? (
                    <Text style={localStyles.errorText}>
                        {errorMessage}
                    </Text>
                ) : null}

                <Text style={styles.bottomMessage}>
                    Already have an account?{" "}
                    <Text 
                        style={localStyles.linkText}
                        onPress={() => router.push("/(auth)/login")}
                    >
                        Log in
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
    floatingLabel: {
        position: "absolute",
        top: -8,
        left: 12,
        backgroundColor: "#fff",
        paddingHorizontal: 4,
        fontSize: 12,
        color: "#666",
        zIndex: 10,
    }
})


