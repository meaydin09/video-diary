import React, { useEffect } from "react";
import { View, Text, Pressable, ActivityIndicator, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useVideoStore } from "@/store/videoStore";
import Ionicons from '@expo/vector-icons/Ionicons';

import { VideoPlayer } from "@/components/VideoPlayer";
import { formatTime } from "@/utils/format";

export default function DetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { toggleFavorite } = useVideoStore();
  const videoItem = useVideoStore((s) =>
    s.videos.find((v) => v.id === id)
  );

  if (!videoItem) {
    return (
      <View className="flex-1 items-center justify-center bg-[#0F0F1A]">
        <ActivityIndicator color="#7c3aed" />
        <Text className="text-white/50 mt-4">Video loading or not found...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#0F0F1A]">
      {/* HEADER */}
      <View className="flex-row items-center justify-between px-5 pt-14 pb-4 z-10">
        <Pressable onPress={() => router.replace("/")} className="p-2 bg-white/5 rounded-full">
          <Ionicons name="home-outline" size={18} color="white" />
        </Pressable>

        <Text className="text-white font-bold text-lg">Details</Text>

        <Pressable
          onPress={() => router.push(`/edit/${videoItem.id}`)}
          className="p-2 bg-violet-500/10 rounded-full border border-violet-500/20"
        >
          <Ionicons name="pencil" size={18} color="#a78bfa" />
        </Pressable>
      </View>

      {/* VIDEO SECTION */}
      <View className="px-5">
        <VideoPlayer
          uri={videoItem.uri}
          className="shadow-2xl"
          pauseWhenModalOpen={true}
        />
        <View className="absolute bottom-4 right-8 bg-black/60 px-3 py-1.5 rounded-xl border border-white/10">
          <Text className="text-white text-[10px] font-bold uppercase tracking-wider">
            Memory Saved
          </Text>
        </View>
      </View>

      {/* CONTENT SECTION */}
      <ScrollView className="flex-1 px-5 mt-6" showsVerticalScrollIndicator={false}>
        <View className="bg-[#1A1A2E] p-6 rounded-[32px] border border-white/5">
          {/* TITLE */}
          <Text className="text-white text-2xl font-extrabold mb-3 tracking-tight">
            {videoItem.name || "Untitled Clip"}
          </Text>

          {/* META DATA */}
          <View className="flex-row items-center gap-2 mb-6">
            <Text className="text-white/40 text-xs font-medium">

              {new Date(videoItem.createdAt).toLocaleDateString('tr-TR')}
            </Text>
            <View className="w-1 h-1 bg-white/20 rounded-full" />
            <View className="bg-violet-500/10 px-2.5 py-1 rounded-lg">
              <Text className="text-violet-400 text-[10px] font-bold uppercase">Personal Diary</Text>
            </View>
          </View>

          {/* DESCRIPTION */}
          <Text className="text-white/60 leading-relaxed text-sm font-medium">
            {videoItem.description || "You haven't added a description for this memory yet."}
          </Text>
        </View>

        {/* BOTTOM ACTIONS */}
        <View className="flex-row gap-4 mt-8 pb-10">
          <Pressable
            className="flex-1 h-16 bg-violet-600 rounded-[24px] items-center justify-center shadow-lg shadow-violet-900"
          >
            <View className="flex-row items-center gap-2">
              <Ionicons name="share-social-outline" size={20} color="white" />
              <Text className="text-white font-bold text-base">Share Story</Text>
            </View>
          </Pressable>

          <Pressable
            onPress={async () => { // async ekle
              try {
                await toggleFavorite(videoItem.id);
              } catch (error) {
                console.error("Favori güncellenemedi kanka");
              }
            }}
            className={`w-16 h-16 rounded-[24px] items-center justify-center border ${videoItem.isFavorite ? 'bg-red-500/10 border-red-500/20' : 'bg-white/5 border-white/10'
              }`}
          >
            <Ionicons
              name={videoItem.isFavorite ? "heart" : "heart-outline"}
              size={24}
              color={videoItem.isFavorite ? "#ef4444" : "white"}
            />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}