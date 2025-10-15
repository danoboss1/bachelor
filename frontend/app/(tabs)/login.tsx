import { Text, View } from '@/components/Themed';
import { TextInput, TouchableOpacity } from 'react-native';
import { styles } from "../../assets/styles/auth.styles";

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
        <View style={[ styles.header, { 
          flex: 1, 
          // justifyContent: 'flex-end',  // zarovná obsah dole
          // alignItems: 'flex-start',    // zarovná obsah doľava
          // marginLeft: 16,              // odsadenie zľava
          // marginBottom: 16,            // odsadenie zospodu
        }]}>
          <Text style={[ styles.title, {
            alignSelf: 'flex-start',
            marginTop: 'auto',
            marginLeft: '5%',
            marginBottom: '5%',
          }]}>Log In</Text>
        </View>

        <View style={{ flex: 3 }}>
          <Text style={styles.label}>Username</Text>
          <TextInput
              style={styles.input}
              placeholder='Enter your username'
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
              style={styles.input}
              placeholder='Enter your password'
              secureTextEntry={true}
          />

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Log in</Text>
          </TouchableOpacity>

          <Text>Don't have an accout? Sign up</Text>
        </View>

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


