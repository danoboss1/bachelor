import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Image,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    TextInput,
    Alert,
    ActivityIndicator,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { styles } from "../../assets/styles/mainScreens.styles";
import { COLORS } from "@/constants/Colors";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { getToken } from "../(auth)/tokenStorage";

const API_URL = "https://bachelor-pi.vercel.app";

type TokenPayload = {
    id: number;
    username: string;
    exp: number;
};

export default function EditProfileScreen() {
    const router = useRouter();

    const [userId, setUserId] = useState<number | null>(null);

    const [username, setUsername] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");

    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [generalError, setGeneralError] = useState("");

    const [loading, setLoading] = useState(false);
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

    async function handleSave() {
        setUsernameError("");
        setPasswordError("");
        setGeneralError("");

        let hasError = false;
        const trimmedUsername = username.trim();

        if (!trimmedUsername) {
            setUsernameError("Username is required");
            hasError = true;
        } else if (trimmedUsername.length < 3 || trimmedUsername.length > 30) {
            setUsernameError("Username length must be between 3 and 30 characters");
            hasError = true;
        }

        if (!currentPassword) {
            setPasswordError("Please enter your current password");
            hasError = true;
        }

        if (hasError) return;

        if (!userId) {
            setGeneralError("User is not loaded");
            return;
        }

        try {
            setLoading(true);

            const token = await getToken();

            await axios.put(
                `${API_URL}/users/${userId}`,
                {
                    username: trimmedUsername,
                    currentPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setCurrentPassword("");
            Alert.alert("Success", "Profile changes were saved");
            router.back();
        } catch (err: any) {
            if (err.response?.data?.errors) {
                const errors = err.response.data.errors;

                if (errors.username) {
                    setUsernameError(errors.username);
                }

                if (errors.currentPassword) {
                    setPasswordError(errors.currentPassword);
                }
            } else if (err.response?.data?.error) {
                setGeneralError(err.response.data.error);
            } else if (err.request) {
                setGeneralError("Cannot connect to server");
            } else {
                setGeneralError("Failed to save profile changes");
            }
        } finally {
            setLoading(false);
        }
    }

    function handleCancel() {
        router.back();
    }

    if (loadingUser) {
        return (
            <View style={[styles.container, localStyles.loadingContainer]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.bgTop}>
                <Text style={styles.header}> Edit Profile </Text>

                <Image
                    source={require("../../assets/images/brainee.png")}
                    style={localStyles.logo}
                />
            </View>

            <View style={styles.bgBottom}>
                <View style={styles.imageContainer}>
                    <View style={localStyles.avatarPlaceholder}>
                        <Image
                            source={require('@/assets/images/profilePicture.png')}
                            style={{
                                width: 80,
                                height: 80,
                                borderRadius: 50,
                                resizeMode: "cover",
                            }}
                        />
                    </View>

                    <Text style={styles.username}>{username.trim() || "Username"}</Text>
                </View>

                <View style={localStyles.formContainer}>
                    <View style={localStyles.inputGroup}>
                        <Text style={localStyles.floatingLabel}>New Username</Text>
                        <TextInput
                            style={localStyles.input}
                            value={username}
                            onChangeText={(text) => {
                                setUsername(text);
                                setUsernameError("");
                                setGeneralError("");
                            }}
                            autoCapitalize="none"
                            autoCorrect={false}
                        />
                        {usernameError ? (
                            <Text style={localStyles.errorText}>{usernameError}</Text>
                        ) : null}
                    </View>

                    <View style={localStyles.inputGroup}>
                        <Text style={localStyles.floatingLabel}>Current Password</Text>
                        <TextInput
                            style={localStyles.input}
                            value={currentPassword}
                            onChangeText={(text) => {
                                setCurrentPassword(text);
                                setPasswordError("");
                                setGeneralError("");
                            }}
                            secureTextEntry
                            autoCapitalize="none"
                            autoCorrect={false}
                            textContentType="password"
                        />
                        {passwordError ? (
                            <Text style={localStyles.errorText}>{passwordError}</Text>
                        ) : null}
                    </View>

                    {generalError ? (
                        <Text style={[localStyles.errorText, { marginTop: 16 }]}>
                            {generalError}
                        </Text>
                    ) : null}

                    <View style={localStyles.buttonsRow}>
                        <TouchableOpacity
                            style={[localStyles.actionButton, localStyles.cancelButton]}
                            onPress={handleCancel}
                            disabled={loading}
                        >
                            <Text style={styles.buttonTextWhite}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                localStyles.actionButton,
                                localStyles.saveButton,
                                loading && localStyles.disabledButton,
                            ]}
                            onPress={handleSave}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonTextWhite}>Save</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}

const localStyles = StyleSheet.create({
    loadingContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    logo: {
        width: 60,
        height: 60,
        resizeMode: "contain",
        alignSelf: "flex-end",
        marginBottom: 14,
        marginRight: "5%",
    },
    avatarPlaceholder: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: COLORS.primary_broskynova,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: COLORS.primary_broskynova,
        alignSelf: "center",
        marginBottom: 10,
    },
    formContainer: {
        marginTop: 30,
        paddingHorizontal: "5%",
    },
    inputGroup: {
        marginTop: 26,
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
    },
    input: {
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderRadius: 12,
        borderColor: COLORS.border,
        fontSize: 16,
        color: COLORS.text,
        padding: 15,
    },
    buttonsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 12,
        marginTop: 36,
    },
    actionButton: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 14,
        borderRadius: 10,
        minHeight: 48,
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 4,
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },
    cancelButton: {
        backgroundColor: "#A0A0A0",
    },
    saveButton: {
        backgroundColor: "#0E8A39",
    },
    disabledButton: {
        opacity: 0.6,
    },
    errorText: {
        color: "red",
        marginTop: 4,
        marginLeft: 4,
        textAlign: "left",
        fontSize: 12,
        fontWeight: "500",
    },
});