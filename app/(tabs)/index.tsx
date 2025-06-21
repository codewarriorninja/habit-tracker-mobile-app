import { DATABASE_ID, databases, HABITS_COLLECTION_ID } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { Habit } from "@/types/database";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Query } from "react-native-appwrite";
import { Button, Text } from "react-native-paper";

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([])
  const {signOut, user} = useAuth();

  useEffect(() => {
    fetchHabit();
  },[user])

  const fetchHabit = async () => {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        HABITS_COLLECTION_ID,
        [Query.equal('user_id', user?.$id ?? "")]
      );
      setHabits(response.documents as Habit[]);
    } catch (error) {
      console.error(error)
    }

  }
  return (
    <View style={styles.view}>
      <View>
        <Text variant="headlineSmall">Today&apos;s Habit</Text>
        <Button mode="text" onPress={signOut} icon={'logout'}>Sign Out</Button>
      </View>
      {habits.length === 0 ? (
        <View>
          {" "}
          <Text>No Habits yet. Add your first Habit!</Text>
        </View>
      ): (
       habits?.map((habit, key) => (
        <View key={key}>
          <Text>{habit.title}</Text>
        </View>
       )) 
      )}
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