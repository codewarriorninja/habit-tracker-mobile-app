import { useAuth } from "@/lib/auth-context";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";

export default function Home() {
  
  const {signOut} = useAuth();

  return (
    <View style={styles.view}>
      <Text>Hello react native.</Text>
      <Button mode="text" onPress={signOut} icon={'logout'}>SignOut</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  view:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
  },
  loginButton:{
    backgroundColor:'#acd16f',
    textAlign:'center',
    color:'#fff',
    fontWeight:'bold',
    borderRadius:10,
    width:100,
    paddingTop:5,
    paddingBottom:5,
  }
})