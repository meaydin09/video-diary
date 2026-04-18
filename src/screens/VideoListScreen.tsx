import { View, Text, FlatList, Pressable, Image } from "react-native";
import { VideoCard } from "@/components/VideoCard";
import { useVideoStore } from "@/store/videoStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { EmptyState } from "@/components/EmptyState";
import { CropModal } from "@/components/CropModal";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export const VideoListScreen = () => {
  const videos = useVideoStore((state) => state.videos);
  const insets = useSafeAreaInsets();
  const openModal = useVideoStore((s) => s.openModal);
  const router = useRouter();



  return (
    <View className="flex-1 bg-[#0d0d18]" >

      {/* HEADER */}
      <View className="px-6 pt-16 pb-4 bg-[#12121d]/60 border-b border-white/5 flex-row justify-between items-center">

        <View>
          <Text className="text-[#e3e0f1] text-2xl font-black">Video Diary</Text>
          <Text className="text-[#ccc3d8]/60 text-sm mt-1">Your memories</Text>
        </View>


        <View className="flex-row items-center gap-4">
          <Pressable className="opacity-60">
            <Text className="text-[#e3e0f1] text-lg">
              <Ionicons name="search" size={24} color="white" />
            </Text>
          </Pressable>
          <View className="w-10 h-10 rounded-full border border-white/15 overflow-hidden">
            <Image
              source={require("../../assets/user.webp")}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        </View>
      </View>


      {/* LIST */}
      <FlatList
        data={videos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 120,
          gap: 12,
        }}
        renderItem={({ item }) => <VideoCard video={item} onPress={() => router.push(`/detail/${item.id}`)} />}
        ListEmptyComponent={
          <EmptyState 
            title="No memories yet" 
            description="Begin your cinematic journal. Tap the button below to preserve your first moment."
            iconName="videocam"
          />
        }
      />

      {/* FAB */}
      <Pressable
        onPress={openModal}
        style={{ bottom: 80 + insets.bottom }}
        className="absolute right-6 z-50 w-16 h-16 rounded-2xl bg-[#7c3aed] items-center justify-center"
      >
        <Text className="text-white text-3xl">+</Text>
      </Pressable>


      <CropModal />
    </View>
  );
}
