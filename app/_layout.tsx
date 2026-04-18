import "../global.css";
import "react-native-gesture-handler";

import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSplashScreen } from "@/hooks/useSplashscreen";

import { SQLiteProvider } from "expo-sqlite";
import { DBService } from "@/services/db.service";
import { useVideoStore } from "@/store/videoStore";

const queryClient = new QueryClient();

export default function RootLayout() {
  const appIsReady = useSplashScreen(0);

  if (!appIsReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#0c0c10" }}>
      <SQLiteProvider
        databaseName="video_diary.db"
        onInit={async (db) => {
          try {
            await DBService.init(db);

            await useVideoStore.getState().loadVideos();

          } catch (error) {
            console.error("Uygulama başlatılırken veritabanı hatası:", error);
          }
        }}
      >
        <QueryClientProvider client={queryClient}>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "#0c0c10" },
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="detail/[id]" />
            <Stack.Screen name="edit/[id]" />
          </Stack>
        </QueryClientProvider>
      </SQLiteProvider>
    </GestureHandlerRootView>
  );
}