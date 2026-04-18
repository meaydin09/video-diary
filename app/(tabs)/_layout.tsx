import { Tabs } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={({ state, navigation }) => (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <View
            style={{
              paddingBottom: insets.bottom,
            }}
            className="bg-[#1f1e2a]/95 pt-3 pb-2 flex-row justify-around items-center rounded-t-[32px]"
          >
            {/* VAULT */}
            <Pressable
              onPress={() => navigation.navigate("index")}
              className={`items-center px-4 py-1 rounded-2xl ${state.index === 0 ? "bg-[#7c3aed]/20" : ""
                }`}
            >
              <Text
                className={`text-lg ${state.index === 0 ? "text-[#d2bbff]" : "text-white/50"
                  }`}
              >
                <Ionicons name="videocam" size={24} color="white" />
              </Text>

              <Text
                className={`text-[10px] font-bold mt-1 ${state.index === 0 ? "text-[#d2bbff]" : "text-white/50"
                  }`}
              >
                Vault
              </Text>
            </Pressable>

            {/* Favorite */}
            <Pressable
              onPress={() => navigation.navigate("favorite")}
              className={`items-center px-4 py-1 rounded-2xl ${state.index === 1 ? "bg-[#7c3aed]/20" : ""
                }`}
            >
              <Text
                className={`text-lg ${state.index === 1 ? "text-[#d2bbff]" : "text-white/50"
                  }`}
              >
                💗
              </Text>

              <Text
                className={`text-[10px] font-bold mt-1 ${state.index === 1 ? "text-[#d2bbff]" : "text-white/50"
                  }`}
              >
                Favorites
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="favorite" />
    </Tabs>
  );
}