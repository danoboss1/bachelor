import { Text, View } from '@/components/Themed';
import axios from "axios";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Dimensions, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
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

    async function registerUser() {
        const registration: RegisterPayload = {
            username,
            password,
        };

        try {
            await axios.post("https://bachelor-pi.vercel.app/register", registration);
        } catch (err: any) {
            console.error("Registration error", err);
        }
    }

    return (
        <View style={styles.container}>
            <View style={[styles.header, {
                flex: 1,
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
            </View>

            <View style={{ flex: 3 }}>
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
                        placeholder="Enter your password"
                        secureTextEntry={true}
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={registerUser}
                >
                    <Text style={styles.buttonText}>Sign up</Text>
                </TouchableOpacity>

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
    }
})
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });


