import { Text, View } from '@/components/Themed';
import { TextInput } from 'react-native';
import { styles } from "../../assets/styles/auth.styles";

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
        <Text>Log In</Text>
        <TextInput
            style={styles.input}
            placeholder='Enter your username'
        />

        <TextInput
            style={styles.input}
            placeholder='Enter your password'
        />

    </View>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });


