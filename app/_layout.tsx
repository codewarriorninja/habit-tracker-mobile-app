import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

const RouteGuard = ({children}: {children: React.ReactNode}) => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const isAuth = false;

  useEffect(() => {
    setIsMounted(true)
  },[])

  useEffect(() => {
    if(isMounted && !isAuth){
      router.replace('/auth')
    }
  },[isMounted]);

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <RouteGuard>
      <Stack>
        <Stack.Screen name="(tabs)" options={{headerShown:false}} />
      </Stack>
    </RouteGuard>
  ) 
}
