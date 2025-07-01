import { DATABASE_ID, databases, HABITS_COLLECTION_ID } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  Dimensions,
  StatusBar,
  TouchableOpacity 
} from "react-native";
import { ID } from "react-native-appwrite";
import {
  Button,
  Text,
  TextInput,
  useTheme,
  Surface,
  IconButton,
} from "react-native-paper";
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const FREQUENCIES = [
  { value: "daily", label: "Daily", icon: "calendar-today" },
  { value: "weekly", label: "Weekly", icon: "calendar-week" },
  { value: "monthly", label: "Monthly", icon: "calendar-month" }
];

type Frequency = "daily" | "weekly" | "monthly";

export default function AddHabitScreen() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [frequency, setFrequency] = useState<Frequency>("daily");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();
  const router = useRouter();
  const theme = useTheme();

  const handleSubmit = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await databases.createDocument(
        DATABASE_ID,
        HABITS_COLLECTION_ID,
        ID.unique(),
        {
          user_id: user.$id,
          title,
          description,
          frequency,
          streak_count: 0,
          last_completed: new Date().toISOString(),
          created_at: new Date().toISOString(),
        }
      );
      
      // Reset form
      setTitle("");
      setDescription("");
      setFrequency("daily");
      setError("");
      
      router.back();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("There was an error creating the habit");
      }
    } finally {
      setLoading(false);
    }
  };

  const FrequencyCard = ({ item, isSelected, onPress }: any) => (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.frequencyCard,
        isSelected && styles.frequencyCardSelected,
        { borderColor: isSelected ? theme.colors.primary : theme.colors.outline }
      ]}
    >
      <View style={styles.frequencyCardContent}>
        <Text 
          style={[
            styles.frequencyLabel,
            { color: isSelected ? theme.colors.primary : theme.colors.onSurface }
          ]}
        >
          {item.label}
        </Text>
        {isSelected && (
          <View style={[styles.selectedIndicator, { backgroundColor: theme.colors.primary }]} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Header Gradient */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary || theme.colors.primary]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <IconButton 
            icon="arrow-left" 
            iconColor="white"
            size={24}
            onPress={() => router.back()}
          />
          <Text style={styles.headerTitle}>Create New Habit</Text>
          <View style={{ width: 48 }} />
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Content Card */}
        <Surface style={[styles.contentCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.formContainer}>
            {/* Title Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: theme.colors.onSurface }]}>
                Habit Title
              </Text>
              <TextInput
                mode="outlined"
                value={title}
                onChangeText={setTitle}
                placeholder="e.g., Drink 8 glasses of water"
                style={styles.input}
                outlineStyle={styles.inputOutline}
                contentStyle={styles.inputContent}
              />
            </View>

            {/* Description Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.inputLabel, { color: theme.colors.onSurface }]}>
                Description
              </Text>
              <TextInput
                mode="outlined"
                value={description}
                onChangeText={setDescription}
                placeholder="Add more details about your habit..."
                multiline
                numberOfLines={3}
                style={[styles.input, styles.textArea]}
                outlineStyle={styles.inputOutline}
                contentStyle={styles.inputContent}
              />
            </View>

            {/* Frequency Selection */}
            <View style={styles.frequencyContainer}>
              <Text style={[styles.inputLabel, { color: theme.colors.onSurface }]}>
                Frequency
              </Text>
              <View style={styles.frequencyGrid}>
                {FREQUENCIES.map((item) => (
                  <FrequencyCard
                    key={item.value}
                    item={item}
                    isSelected={frequency === item.value}
                    onPress={() => setFrequency(item.value as Frequency)}
                  />
                ))}
              </View>
            </View>

            {/* Error Message */}
            {error && (
              <Surface style={[styles.errorContainer, { backgroundColor: theme.colors.errorContainer }]}>
                <Text style={[styles.errorText, { color: theme.colors.onErrorContainer }]}>
                  {error}
                </Text>
              </Surface>
            )}
          </View>
        </Surface>

        {/* Submit Button */}
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={!title.trim() || !description.trim() || loading}
            loading={loading}
            style={styles.submitButton}
            contentStyle={styles.submitButtonContent}
            labelStyle={styles.submitButtonLabel}
          >
            {loading ? "Creating Habit..." : "Create Habit"}
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  headerGradient: {
    paddingTop: StatusBar.currentHeight || 44,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  
  scrollView: {
    flex: 1,
  },
  
  scrollContent: {
    paddingTop: 24,
    paddingBottom: 32,
  },
  
  contentCard: {
    marginHorizontal: 16,
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  
  formContainer: {
    padding: 24,
  },
  
  inputContainer: {
    marginBottom: 24,
  },
  
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  
  input: {
    backgroundColor: 'transparent',
  },
  
  inputOutline: {
    borderRadius: 12,
    borderWidth: 1.5,
  },
  
  inputContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  
  textArea: {
    minHeight: 80,
  },
  
  frequencyContainer: {
    marginBottom: 24,
  },
  
  frequencyGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  
  frequencyCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1.5,
    padding: 16,
    minHeight: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  
  frequencyCardSelected: {
    backgroundColor: 'rgba(103, 80, 164, 0.08)',
  },
  
  frequencyCardContent: {
    alignItems: 'center',
    position: 'relative',
  },
  
  frequencyLabel: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  selectedIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 24,
    height: 3,
    borderRadius: 2,
  },
  
  errorContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  
  buttonContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  
  submitButton: {
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  
  submitButtonContent: {
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  
  submitButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});