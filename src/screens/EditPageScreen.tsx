import React, { useState } from "react";
import {
  View, Text, Pressable,
  KeyboardAvoidingView, Platform, ScrollView, Alert
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useVideoStore } from "@/store/videoStore";
import Ionicons from '@expo/vector-icons/Ionicons';

import { VideoPlayer } from "@/components/VideoPlayer";
import { MetadataForm } from "@/components/MetaDataForm";
import { videoMetadataSchema } from "@/utils/validation";

export default function EditScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const videoItem = useVideoStore((s) => s.videos.find((v) => v.id === id));
  const updateVideo = useVideoStore((s) => s.updateVideo);

  const [name, setName] = useState(videoItem?.name || "");
  const [description, setDescription] = useState(videoItem?.description || "");
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

  const handleSave = async () => {
    const result = videoMetadataSchema.safeParse({ name, description });

    if (!result.success) {
      const formatted = result.error.format();
      setErrors({
        name: formatted.name?._errors[0],
        description: formatted.description?._errors[0],
      });
      return;
    }

    setErrors({});

    await updateVideo(id as string, { name, description });
    router.back();
  };

  if (!videoItem) {
    return (
      <View className="flex-1 bg-[#0F0F1A] items-center justify-center">
        <Text className="text-white opacity-50">Video bulunamadı...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-[#0F0F1A]"
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >

        {/* HEADER */}
        <View className="flex-row items-center justify-between px-5 pt-14 pb-4">
          <Pressable
            onPress={() => router.back()}
            className="p-2 bg-white/5 rounded-full border border-white/10"
          >
            <Ionicons name="chevron-back" size={20} color="white" />
          </Pressable>
          <Text className="text-white font-bold text-lg">Edit Memory</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* PREVIEW  */}
        <View className="px-5 mb-6">
          <VideoPlayer uri={videoItem.uri} />
        </View>

        {/* FORM  */}
        <View className="px-5">
          <Text className="text-violet-400 text-[10px] font-bold uppercase tracking-widest mb-4 ml-2">
            Update Details
          </Text>

          <MetadataForm
            name={name}
            setName={setName}
            description={description}
            setDescription={setDescription}
            errors={errors}
          />

          <Pressable
            onPress={handleSave}
            className="mt-8 h-16 bg-violet-600 rounded-[24px] items-center justify-center shadow-lg shadow-violet-900/50"
          >
            <View className="flex-row items-center gap-2">
              <Ionicons name="checkmark-circle-outline" size={20} color="white" />
              <Text className="text-white font-extrabold text-base">Save Changes</Text>
            </View>
          </Pressable>

          <Pressable
            onPress={() => router.back()}
            className="mt-4 py-2 items-center"
          >
            <Text className="text-white/30 text-xs font-bold uppercase tracking-widest">Cancel</Text>
          </Pressable>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}