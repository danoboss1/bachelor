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

    async function loginUser() {
        const login: LoginPayload = {
            username,
            password,
        };

        try {
            await await axios.post("https://bachelor-pi.vercel.app/login", login);
            router.replace("/games");
        } catch (err: any) {
            console.error("Login error", err);
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
                {/* <View style={{ flexDirection: "row", justifyContent: "center" }}>
                    <Text style={styles.bottomMessage}>
                        Don't have an account?{" "}
                    </Text>

                    <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
                        <Text style={localStyles.linkText}>
                            Sign up
                        </Text>
                    </TouchableOpacity>
                </View> */}
            </View>

        </View>
    );
}

const localStyles = StyleSheet.create({
    linkText: {
        color:  "#1E90FF", 
        fontWeight: "600",
        textDecorationLine: "underline",
    }
})
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });


