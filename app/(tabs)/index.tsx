import { client, DATABASE_ID, databases, HABITS_COLLECTION_ID, RealTimeResponse } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { Habit } from "@/types/database";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Query } from "react-native-appwrite";
import { Button, Surface, Text } from "react-native-paper";

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([])
  const {signOut, user} = useAuth();

  useEffect(() => {
    if(user){
    const channel = `databases.${DATABASE_ID}.collections.${HABITS_COLLECTION_ID}.documents`;
    const habitSubscription = client.subscribe(channel,
    (response:RealTimeResponse) => {
      if(response.events.includes('databases.*.collections.*.documents.*.create')){
        fetchHabit();
      }else if(response.events.includes('databases.*.collections.*.documents.*.update')){
        fetchHabit();
      }else if(response.events.includes('databases.*.collections.*.documents.*.delete')){
        fetchHabit();
      }
    }
    )

    fetchHabit();

    return () => {
      habitSubscription();
    };
  }
  },[user]);

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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>Today&apos;s Habit</Text>
        <Button mode="text" 
         onPress={signOut} 
         icon={'logout'}>Sign Out</Button>
      </View>

      <ScrollView 
      showsVerticalScrollIndicator={false}
      >
      {habits.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No Habits yet. Add your first Habit!</Text>
        </View>
      ): (
        habits?.map((habit) => (
          <Surface key={habit.$id} style={styles.card} elevation={0}>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{habit.title}</Text>
              <Text style={styles.cardDescription}>{habit.description}</Text>
              <View style={styles.cardFooter}>
                <View style={styles.streakBadge}>
                  <MaterialCommunityIcons 
                    name='fire' 
                    size={18} 
                    color={'#ff9800'} 
                  />
                  <Text style={styles.streakText}>{habit.streak_count} day streak</Text>
                </View>
                <View style={styles.frequencyBadge}>
                  <Text style={styles.frequencyText}>
                    {" "}
                    {habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}
                  </Text>
                </View>
              </View>
            </View>
          </Surface>
        )) 
      )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    padding:16,
    backgroundColor:'#f5f5f5',
  },

  header:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginBottom:24,
  },

  title:{
    fontSize:24,
    fontWeight:'bold',
  },
  emptyState:{
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyStateText:{
    color: "#666666",
  },

  card: {
    marginBottom: 18,
    borderRadius: 18,
    backgroundColor: "#f7f2fa",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  
  cardContent:{
    padding:20,
  },

  cardTitle:{
    fontSize:20,
    fontWeight:'bold',
    marginBottom:4,
    color: "#22223b",
  },

  cardDescription:{
    fontSize:15,
    marginBottom:16,
    color: "#6c6c80",
  },

  cardFooter:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
  },

  streakBadge:{
    flexDirection:'row',
    alignItems:'center',
    backgroundColor: "#fff3e0",
    borderRadius:12,
    paddingHorizontal:10,
    paddingVertical:2,
  },

  streakText:{
    marginLeft:6,
    color: "#ff9800",
    fontWeight:'bold',
    fontSize:14
  },

  frequencyBadge:{
    backgroundColor: "#ede7f6",
    borderRadius:12,
    paddingHorizontal:12,
    paddingVertical:4,
  },

  frequencyText:{
    color: "#7c4dff",
    fontWeight:'bold',
    fontSize:14,
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