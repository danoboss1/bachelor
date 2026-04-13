import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Image, Text, View, TouchableOpacity, StyleSheet, TextInput, Alert } from "react-native";
import { styles } from "../../assets/styles/mainScreens.styles";
import { COLORS } from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { getToken } from "../(auth)/tokenStorage";
import { useEffect } from "react";
import { API_BASE_URL } from "@/constants/config";

const API_URL = `${API_BASE_URL}`;

type TokenPayload = {
    id: number;
    username: string;
    exp: number;
};

export default function editPasswordScreen() {
    const router = useRouter();

    const [userId, setUserId] = useState<number | null>(null);

    const [username, setUsername] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const [currentPasswordError, setCurrentPasswordError] = useState("");
    const [newPasswordError, setNewPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [generalError, setGeneralError] = useState("");

    const [loading, setLoading] = useState(false);
    const [loadingUser, setLoadingUser] = useState(true);

    useEffect(() => {
        async function loadUserFromToken() {
            try {
                const token = await getToken();

                if (!token) {
                    setGeneralError("User is not logget in");
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
    }, [userId])

    async function handleSave() {
        setCurrentPasswordError("");
        setNewPasswordError("");
        setConfirmPasswordError("");
        setGeneralError("");

        let hasError = false;

        if (!currentPassword.trim()) {
            setCurrentPasswordError("Please enter your current password");
            hasError = true;
        }

        if (!newPassword.trim()) {
            setNewPasswordError("Please enter a new password");
            hasError = true;
        }

        if (!confirmNewPassword.trim()) {
            setConfirmPasswordError("Please confirm your new password");
            hasError = true;
        }

        if (
            newPassword.trim() &&
            confirmNewPassword.trim() &&
            newPassword !== confirmNewPassword
        ) {
            setConfirmPasswordError("Passwords do not match");
            hasError = true;
        }

        if (
            currentPassword.trim() &&
            newPassword.trim() &&
            currentPassword === newPassword
        ) {
            setNewPasswordError("New password must be different from current password");
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

            if (!token) {
                setGeneralError("User is not logged in");
                router.replace("/(auth)/login");
                return;
            }

            await axios.put(
                `${API_URL}/users/${userId}/password`,
                {
                    currentPassword,
                    newPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");

            Alert.alert("Success", "Password was changed");
            router.back();
        } catch (err: any) {
            if (err.response?.data?.errors) {
                const errors = err.response.data.errors;

                if (errors.currentPassword) {
                    setCurrentPasswordError(errors.currentPassword);
                }

                if (errors.newPassword) {
                    setNewPasswordError(errors.newPassword);
                }
            } else if (err.response?.data?.error) {
                setGeneralError(err.response.data.error);
            } else if (err.request) {
                setGeneralError("Cannot connect to server");
            } else {
                setGeneralError("Failed to change password");
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
                <Text style={styles.header}> Edit Password </Text>

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

            <View style={styles.bgBottom}>
                <View style={styles.imageContainer}>
                    {/* <Image
                        source={require('../../assets/images/profile_picture_placeholder.png')}
                        style={styles.profileImage}
                    /> */}
                    {/* <Text style={styles.userID}> @userID </Text> */}

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
                        <Text style={localStyles.floatingLabel}>Current Password</Text>
                        <TextInput
                            style={localStyles.input}
                            value={currentPassword}
                            onChangeText={(text) => {
                                setCurrentPassword(text);
                                setCurrentPasswordError("");
                            }}
                            secureTextEntry
                            autoCapitalize="none"
                            autoCorrect={false}
                            textContentType="password"
                        />
                        {currentPasswordError ? (
                            <Text style={localStyles.errorText}>{currentPasswordError}</Text>
                        ) : null}
                    </View>

                    <View style={localStyles.inputGroup}>
                        <Text style={localStyles.floatingLabel}>New Password</Text>
                        <TextInput
                            style={localStyles.input}
                            value={newPassword}
                            onChangeText={(text) => {
                                setNewPassword(text);
                                setNewPasswordError("");
                            }}
                            secureTextEntry
                            autoCapitalize="none"
                            autoCorrect={false}
                            textContentType="newPassword"
                        />
                        {newPasswordError ? (
                            <Text style={localStyles.errorText}>{newPasswordError}</Text>
                        ) : null}
                    </View>

                    <View style={localStyles.inputGroup}>
                        <Text style={localStyles.floatingLabel}>Confirm New Password</Text>
                        <TextInput
                            style={localStyles.input}
                            value={confirmNewPassword}
                            onChangeText={(text) => {
                                setConfirmNewPassword(text);
                                setConfirmPasswordError("");
                            }}
                            secureTextEntry
                            autoCapitalize="none"
                            autoCorrect={false}
                            textContentType="password"
                        />
                        {confirmPasswordError ? (
                            <Text style={localStyles.errorText}>{confirmPasswordError}</Text>
                        ) : null}
                    </View>

                    <View style={localStyles.buttonsRow}>
                        <TouchableOpacity
                            style={[localStyles.actionButton, localStyles.cancelButton]}
                            onPress={handleCancel}
                        >
                            <Text style={styles.buttonTextWhite}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[localStyles.actionButton, localStyles.saveButton]}
                            onPress={handleSave}
                        >
                            <Text style={styles.buttonTextWhite}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}


const localStyles = StyleSheet.create({
    loadingContainer: {
        justifyContent: "center",
        alignItems: "center",
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
    errorText: {
        color: "red",
        marginTop: 4,
        marginLeft: 4,
        textAlign: "left",
        fontSize: 12,
        fontWeight: "500",
    },
})