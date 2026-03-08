import { useRouter } from "expo-router";
import { Dimensions, Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from "../../assets/styles/mainScreens.styles";
import { COLORS } from "@/constants/Colors";
import { Color } from "@/constants/TWPalette";

const { width, height } = Dimensions.get("window");

const EDIT_PROFILE_ROUTE = "/editProfile/editProfile";
const EDIT_PASSWORD_ROUTE = "/editProfile/editPassword";

export default function ProfileScreen() {
    const router = useRouter();

    async function handleLogout() {
        try {
            router.replace("/(auth)/login");
        } catch (error) {
            console.log("Logout error:", error);
        }
    }
    
    return (
        <View style={styles.container}>
            <View style={styles.bgTop}>
                <Text style={styles.header}> Profile </Text>

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
                {/* <CogIcon></CogIcon> */}

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

                <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                        style={styles.editButton}
                        onPress={() => router.push(EDIT_PROFILE_ROUTE)}
                    >
                        <MaterialCommunityIcons 
                            name="square-edit-outline" 
                            // color="#FF6905" 
                            color={COLORS.primary}
                            size={24} 
                        />
                        <Text style={styles.buttonText}>Edit Profile</Text>
                        <MaterialCommunityIcons 
                            name="chevron-right" 
                            // color="#FF6905" 
                            color={COLORS.primary}
                            size={24} 
                        />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.editButton}
                        onPress={() => router.push(EDIT_PASSWORD_ROUTE)}
                    >
                        <MaterialCommunityIcons 
                            name="square-edit-outline" 
                            // color="#FF6905" 
                            color={COLORS.primary}
                            size={24} 
                        />
                        <Text style={styles.buttonText}>Edit Password</Text>
                        <MaterialCommunityIcons 
                            name="chevron-right" 
                            // color="#FF6905" 
                            color={COLORS.primary}
                            size={24} 
                        />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.logoutButton}
                        onPress={handleLogout}
                    >
                        <MaterialCommunityIcons 
                            name="logout" 
                            color="#FF1E1E" 
                            size={24} 
                        />
                        <Text style={styles.buttonText}>Logout</Text>
                        <MaterialCommunityIcons 
                            name="chevron-right" 
                            color="#FF1E1E" 
                            size={24} 
                        />
                    </TouchableOpacity>
                </View>

                {/* <View style={{ flex: 1, justifyContent: "flex-end" }}>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Edit Profile</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Edit Password</Text>
                        </TouchableOpacity>
                    </View>
                </View> */}

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
})
