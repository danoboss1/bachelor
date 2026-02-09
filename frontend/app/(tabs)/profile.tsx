import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from "../../assets/styles/mainScreens.styles";
const { width, height } = Dimensions.get("window");

export default function ProfileScreen() {
    return (
        <View style={styles.container}>

            <View style={[styles.bgTop, {
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
            }]}>
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
                    <Text style={styles.userID}> @userID </Text>
                    <Text style={styles.username}> Jozko Mrkvicka </Text>
                </View>

                {/* <View style={styles.textContainer}>
                    <Text style={styles.username}> Jozko Mrkvicka </Text>
                </View> */}

                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.editButton}>
                        <MaterialCommunityIcons name="square-edit-outline" color="#FF6905" size={24} />
                        <Text style={styles.buttonText}>Edit Profile</Text>
                        <MaterialCommunityIcons name="chevron-right" color="#FF6905" size={24} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.editButton}>
                        <MaterialCommunityIcons name="square-edit-outline" color="#FF6905" size={24} />
                        <Text style={styles.buttonText}>Edit Password</Text>
                        <MaterialCommunityIcons name="chevron-right" color="#FF6905" size={24} />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.logoutButton}>
                        <MaterialCommunityIcons name="logout" color="#FF1E1E" size={24} />
                        <Text style={styles.buttonText}>Logout</Text>
                        <MaterialCommunityIcons name="chevron-right" color="#FF1E1E" size={24} />
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

