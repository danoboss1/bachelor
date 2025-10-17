import { Text, View } from '@/components/Themed';
import { styles } from "../../assets/styles/mainScreens.styles";

export default function GamesScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.background}>
                <View style={styles.bgTop}></View>
                <View style={styles.bgBottom}></View>
            </View>

            <View style={styles.content}>
                <Text>Games</Text>

                <View style={styles.rectangle} />
            </View>
        </View>
    )
}