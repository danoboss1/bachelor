import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Text, View, TouchableOpacity, StyleSheet, TextInput, Alert } from "react-native";
import { styles } from "../../assets/styles/mainScreens.styles";
import { COLORS } from "@/constants/Colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function editPasswordScreen() {
    const router = useRouter();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const [currentPasswordError, setCurrentPasswordError] = useState("");
    const [newPasswordError, setNewPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    function handleSave() {
        setCurrentPasswordError("");
        setNewPasswordError("");
        setConfirmPasswordError("");

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

        // sem si potom doplníš API call
        Alert.alert("Success", "Password was changed");
    }

    function handleCancel() {
        router.back();
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

                                        {/* Avatar Placeholder */}
                    <View style={localStyles.avatarPlaceholder}>
                        <MaterialCommunityIcons
                            name="account-outline"
                            size={70}
                            // color="#FF6905"
                            color={COLORS.primary}
                        />
                    </View>
                    <Text style={styles.username}> Jozko Mrkvicka </Text>
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
    avatarPlaceholder: {
        width: 140,
        height: 140,
        borderRadius: 70,
        // backgroundColor: "#FFF3EC",
        // backgroundColor: Color.orange[50],
        backgroundColor: COLORS.primary_broskynova,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        // borderColor: "#FFD2B8",
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
    // button a error text aby sedel so signup
})