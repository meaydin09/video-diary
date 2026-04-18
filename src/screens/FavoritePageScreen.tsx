import React from "react";
import { View, Text, FlatList } from "react-native";
import { useVideoStore } from "@/store/videoStore";
import { useShallow } from "zustand/react/shallow";
import { VideoCard } from "@/components/VideoCard";
import { EmptyState } from "@/components/EmptyState";
import { useRouter } from "expo-router";
import Ionicons from '@expo/vector-icons/Ionicons';

export const FavoritesScreen = () => {
  const router = useRouter();

  const favoriteVideos = useVideoStore(
    useShallow((state) => state.videos.filter((v) => v.isFavorite))
  );

  return (
    <View className="flex-1 bg-[#0c0c10] px-5">
      {/* Header */}
      <View className="pt-16 pb-6">
        <Text className="text-white text-3xl font-extrabold tracking-tight">
          Favorites
        </Text>
        <Text className="text-violet-400/60 text-sm font-medium mt-1">
          {favoriteVideos.length} memories you loved
        </Text>
      </View>

      <FlatList
        data={favoriteVideos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <VideoCard
            video={item}
            showFavorite={true}
            onPress={() => router.push(`/detail/${item.id}`)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          paddingTop: 16,
          paddingBottom: 100 
        }}
        ListEmptyComponent={
          <EmptyState 
            title="No favorites yet" 
            description="Tap the heart icon on your memories to see them here."
            iconName="heart-dislike-outline"
          />
        }
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
      />
    </View>
  );
};