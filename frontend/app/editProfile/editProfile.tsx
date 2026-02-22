import { useRouter } from "expo-router";
import { useState } from "react";
import { Dimensions, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "../../assets/styles/mainScreens.styles";

const { width, height } = Dimensions.get("window");

export default function editProfileScreen() {
    const router = useRouter();

    const [username, setUsername] = useState("John Mrkvicka");

    const [originalUsername] = useState("Jozko Mrkvicka");

    return (
        <View style={styles.container}>
            <View style={styles.bgTop}>
                <Text style={styles.header}> Edit Profile </Text>

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
                    <Image
                        source={require('../../assets/images/profile_picture_placeholder.png')}
                        style={styles.profileImage}
                    />

                    <View style={{ marginHorizontal: "5%", marginTop: 24 }}>
                        <Text style={localStyles.label}> Username </Text>

                        <TextInput
                            style={localStyles.input}
                            value={username}
                            onChangeText={setUsername}
                            placeholder="Enter username"
                        />
                    </View>

                </View>
            </View>

            <View style={localStyles.buttonContainer}>
                <TouchableOpacity style={localStyles.button}>
                    <Text> Cancel </Text>
                </TouchableOpacity>

                <TouchableOpacity style={localStyles.button}>
                    <Text> Save </Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}

const localStyles = StyleSheet.create({
    label: {
        fontSize: 14,
        marginBottom: 6,
        color: "#666"
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: "#fff",
    },
    button: {
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        width: width * 0.4,
        // backgroundColor: "#F5F5F5",
        backgroundColor: "black",
        minHeight: 48,
        paddingVertical: 12,
        paddingHorizontal: width * 0.025,
        marginBottom: 100,
    },
    buttonContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "white",
        // backgroundColor: "#F5F5F5",
    }
})