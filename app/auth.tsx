import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { 
  KeyboardAvoidingView, 
  Platform, 
  StyleSheet, 
  View, 
  ScrollView,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  Animated
} from "react-native";
import { 
  Button, 
  Text, 
  TextInput, 
  useTheme, 
  Surface,
  IconButton,
  Divider
} from "react-native-paper";
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string | null>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const theme = useTheme();
  const router = useRouter();
  const { signIn, signUp } = useAuth();

  const handleAuth = async () => {
    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Passwords must be at least 6 characters long.");
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        const error = await signUp(email, password);
        if (error) {
          setError(error);
          return;
        }
      } else {
        const error = await signIn(email, password);
        if (error) {
          setError(error);
          return;
        }
        router.replace("/");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchMode = () => {
    setIsSignUp((prev) => !prev);
    setError(null);
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.secondary || theme.colors.primary]}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo/Brand Section */}
          <View style={styles.brandSection}>
            <View style={[styles.logoContainer, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.logoText, { color: theme.colors.primary }]}>H</Text>
            </View>
            <Text style={styles.brandTitle}>HabitTracker</Text>
            <Text style={styles.brandSubtitle}>Build better habits, one day at a time</Text>
          </View>

          {/* Auth Form Card */}
          <Surface style={[styles.authCard, { backgroundColor: theme.colors.surface }]}>
            <View style={styles.authHeader}>
              <Text style={[styles.authTitle, { color: theme.colors.onSurface }]}>
                {isSignUp ? "Create Account" : "Welcome Back"}
              </Text>
              <Text style={[styles.authSubtitle, { color: theme.colors.onSurfaceVariant }]}>
                {isSignUp 
                  ? "Start your journey to better habits"
                  : "Sign in to continue your progress"
                }
              </Text>
            </View>

            <View style={styles.formContainer}>
              {/* Email Input */}
              <View style={styles.inputContainer}>
                <TextInput
                  label="Email Address"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  placeholder="example@gmail.com"
                  mode="outlined"
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                  outlineStyle={styles.inputOutline}
                  contentStyle={styles.inputContent}
                  left={<TextInput.Icon icon="email-outline" />}
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <TextInput
                  label="Password"
                  autoCapitalize="none"
                  mode="outlined"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  style={styles.input}
                  outlineStyle={styles.inputOutline}
                  contentStyle={styles.inputContent}
                  left={<TextInput.Icon icon="lock-outline" />}
                  right={
                    <TextInput.Icon 
                      icon={showPassword ? "eye-off" : "eye"} 
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  }
                />
              </View>

              {/* Confirm Password Input (Sign Up only) */}
              {isSignUp && (
                <View style={styles.inputContainer}>
                  <TextInput
                    label="Confirm Password"
                    autoCapitalize="none"
                    mode="outlined"
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    style={styles.input}
                    outlineStyle={styles.inputOutline}
                    contentStyle={styles.inputContent}
                    left={<TextInput.Icon icon="lock-check-outline" />}
                    right={
                      <TextInput.Icon 
                        icon={showConfirmPassword ? "eye-off" : "eye"} 
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      />
                    }
                  />
                </View>
              )}

              {/* Error Message */}
              {error && (
                <Surface style={[styles.errorContainer, { backgroundColor: theme.colors.errorContainer }]}>
                  <Text style={[styles.errorText, { color: theme.colors.onErrorContainer }]}>
                    {error}
                  </Text>
                </Surface>
              )}

              {/* Auth Button */}
              <Button
                mode="contained"
                onPress={handleAuth}
                loading={loading}
                disabled={loading}
                style={styles.authButton}
                contentStyle={styles.authButtonContent}
                labelStyle={styles.authButtonLabel}
              >
                {loading 
                  ? (isSignUp ? "Creating Account..." : "Signing In...") 
                  : (isSignUp ? "Create Account" : "Sign In")
                }
              </Button>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <Divider style={styles.divider} />
                <Text style={[styles.dividerText, { color: theme.colors.onSurfaceVariant }]}>
                  OR
                </Text>
                <Divider style={styles.divider} />
              </View>

              {/* Switch Mode Button */}
              <TouchableOpacity
                onPress={handleSwitchMode}
                style={styles.switchModeContainer}
                disabled={loading}
              >
                <Text style={[styles.switchModeText, { color: theme.colors.onSurfaceVariant }]}>
                  {isSignUp ? "Already have an account? " : "Don't have an account? "}
                  <Text style={[styles.switchModeLink, { color: theme.colors.primary }]}>
                    {isSignUp ? "Sign In" : "Sign Up"}
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
          </Surface>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.colors.onSurfaceVariant }]}>
              By continuing, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.4,
  },

  keyboardView: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
    paddingTop: StatusBar.currentHeight || 44,
  },

  brandSection: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 32,
    paddingHorizontal: 24,
  },

  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },

  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
  },

  brandTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },

  brandSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },

  authCard: {
    marginHorizontal: 24,
    borderRadius: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    marginBottom: 24,
  },

  authHeader: {
    padding: 24,
    paddingBottom: 16,
    alignItems: 'center',
  },

  authTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },

  authSubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },

  formContainer: {
    padding: 24,
    paddingTop: 8,
  },

  inputContainer: {
    marginBottom: 16,
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

  errorContainer: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },

  errorText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },

  authButton: {
    borderRadius: 16,
    marginTop: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  authButtonContent: {
    paddingVertical: 8,
  },

  authButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },

  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },

  divider: {
    flex: 1,
  },

  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    fontWeight: '500',
  },

  switchModeContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },

  switchModeText: {
    fontSize: 16,
    textAlign: 'center',
  },

  switchModeLink: {
    fontWeight: '600',
    textDecorationLine: 'underline',
  },

  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: 'center',
  },

  footerText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
});