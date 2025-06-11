import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.view}>
      <Text>Hello react native.</Text>
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