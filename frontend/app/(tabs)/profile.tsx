import { useRouter } from "expo-router";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from "../../assets/styles/mainScreens.styles";

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
                    <Image
                        source={require('../../assets/images/profile_picture_placeholder.png')}
                        style={styles.profileImage}
                    />
                    {/* <Text style={styles.userID}> @userID </Text> */}
                    <Text style={styles.username}> Jozko Mrkvicka </Text>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity 
                        style={styles.editButton}
                        onPress={() => router.push(EDIT_PROFILE_ROUTE)}
                    >
                        <MaterialCommunityIcons 
                            name="square-edit-outline" 
                            color="#FF6905" 
                            size={24} 
                        />
                        <Text style={styles.buttonText}>Edit Profile</Text>
                        <MaterialCommunityIcons 
                            name="chevron-right" 
                            color="#FF6905" 
                            size={24} 
                        />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.editButton}
                        onPress={() => router.push(EDIT_PASSWORD_ROUTE)}
                    >
                        <MaterialCommunityIcons 
                            name="square-edit-outline" 
                            color="#FF6905" 
                            size={24} 
                        />
                        <Text style={styles.buttonText}>Edit Password</Text>
                        <MaterialCommunityIcons 
                            name="chevron-right" 
                            color="#FF6905" 
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

