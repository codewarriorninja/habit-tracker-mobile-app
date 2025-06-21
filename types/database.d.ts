import { Models } from "react-native-appwrite";

interface Habit extends Models.Document {
    user_id:string;
    title:string;
    description:string;
    frequency:string;
    streak_count:number,
    last_completed:string;
    created_at:Date
}