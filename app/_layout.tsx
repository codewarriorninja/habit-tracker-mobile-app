import { AuthProvider, useAuth } from "@/lib/auth-context";
import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect} from "react";

const RouteGuard = ({children}: {children: React.ReactNode}) => {
  const router = useRouter();

  const {user, isLoadingUser} = useAuth();

  const segments = useSegments();

  useEffect(() => {
    const inAuthGroup = segments[0] === "auth";

    if (!user && !inAuthGroup && !isLoadingUser) {
      router.replace("/auth");
    } else if (user && inAuthGroup && !isLoadingUser) {
      router.replace("/");
    }
  }, [user, segments, isLoadingUser]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
    <RouteGuard>
      <Stack>
        <Stack.Screen name="(tabs)" options={{headerShown:false}} />
        <Stack.Screen name="auth" options={{title:'Auth'}} />
      </Stack>
    </RouteGuard>
    </AuthProvider>
  ) 
}
