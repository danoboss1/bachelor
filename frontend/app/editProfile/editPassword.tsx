import { useRouter } from "expo-router";
import { Image, Text, View } from "react-native";
import { styles } from "../../assets/styles/mainScreens.styles";

export default function editPasswordScreen() {
    const router = useRouter();

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

            </View>
        </View>
    )
}