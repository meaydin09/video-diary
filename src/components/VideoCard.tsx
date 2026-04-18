import { View, Text, Image, Pressable, Alert } from "react-native";
import { VideoItem } from "@/types";
import { useVideoStore } from "@/store/videoStore";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from "expo-router";

interface Props {
  video: VideoItem;
  onPress?: () => void;
  showFavorite?: boolean;
}

export const VideoCard = ({ video, onPress, showFavorite = false }: Props) => {
  const { removeVideo, toggleFavorite } = useVideoStore();
  const router = useRouter();

  const handleDelete = () => {
    Alert.alert(
      "Delete Memory",
      "Are you sure you want to delete this video?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await removeVideo(video.id);

            } catch (error) {
              Alert.alert("Error", "Could not delete the video.");
            }
          }
        },
      ]
    );
  };

  return (
    <Pressable
      onPress={onPress}
      className="bg-[#1f1e2a]/60 border border-white/5 p-3 rounded-2xl flex-row gap-4 relative mb-3"
    >
      {/* Thumbnail */}
      <View className="w-20 h-20 rounded-xl overflow-hidden">
        <Image
          source={{ uri: video.thumbnail || video.uri }}
          className="w-full h-full"
          resizeMode="cover"
        />
        <View className="absolute inset-0 bg-black/10" />
      </View>


      <View className="flex-1 justify-center pr-20">
        <Text
          className="text-[#e3e0f1] font-bold text-base"
          numberOfLines={1}
        >
          {video.name || "Untitled"}
        </Text>
        <Text
          className="text-[#ccc3d8]/70 text-sm mt-1 leading-tight"
          numberOfLines={2}
        >
          {video.description || "No description added."}
        </Text>
      </View>


      <View className="absolute top-3 right-3 bg-black/40 px-2 py-0.5 rounded-lg border border-white/10">
        <Text className="text-[10px] font-bold tracking-widest text-white uppercase">
          5s
        </Text>
      </View>


      <View className="absolute bottom-3 right-3 flex-row gap-2">


        {showFavorite && (
          <Pressable
            onPress={async (e) => {
              e.stopPropagation();
              await toggleFavorite(video.id);
            }}
            className="w-8 h-8 items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20"
          >
            <Ionicons
              name={video.isFavorite ? "heart" : "heart-outline"}
              size={16}
              color={video.isFavorite ? "#ef4444" : "white"}
            />
          </Pressable>
        )}


        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            router.push(`/edit/${video.id}`);
          }}
          className="w-8 h-8 items-center justify-center rounded-lg bg-violet-500/10 border border-violet-500/20"
        >
          <Ionicons name="pencil-outline" size={16} color="#a78bfa" />
        </Pressable>


        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          className="w-8 h-8 items-center justify-center rounded-lg bg-red-500/10 border border-red-500/20"
        >
          <Ionicons name="trash-outline" size={16} color="#ef4444" />
        </Pressable>
      </View>
    </Pressable>
  );
};