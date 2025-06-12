import { View, Text, KeyboardAvoidingView, Platform, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native'
import {TextInput} from 'react-native-paper'



const AuthScreen = () => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={styles.container}
    >
        <View style={styles.content}>
            <Text style={styles.title}>
            {" "}
            Create Account
            </Text>
            <TextInput
                label='Email'
                autoCapitalize='none'
                keyboardType='email-address'
                placeholder='example@gmail.com'
                style={styles.input}
            />
            <TextInput
                label='Password'
                autoCapitalize='none'
                mode='outlined'
                secureTextEntry={true}
                placeholder='password'
                style={styles.input}
            />
        </View>
    </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  )
}

export default AuthScreen

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#f5f5f5'
    },
    content:{
        flex:1,
        padding:16,
        justifyContent:'center',
    },
    title:{
        textAlign:'center',
        marginBottom:24
    },
    input:{
        marginBottom:16
    }
})