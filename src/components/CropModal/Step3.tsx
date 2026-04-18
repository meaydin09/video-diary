import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useVideoStore } from "@/store/videoStore";
import { useRouter } from "expo-router";

import Animated, { FadeInDown, useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

import { MetadataForm } from "@/components/MetaDataForm";
import { VideoPlayer } from "@/components/VideoPlayer";
import { useTrimVideo } from "@/hooks/useTrimVideo";
import { formatTime } from "@/utils/format";
import { videoMetadataSchema } from "@/utils/validation";

export const Step3 = () => {
  const router = useRouter();
  const { selectedVideo, currentTrim, addVideo, closeModal } = useVideoStore();
  const { startTime = 0, endTime = 5 } = currentTrim ?? {};

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});

  const { mutate: handleTrim, isPending } = useTrimVideo(async (data) => {
    const id = Date.now().toString();
    await addVideo({
      id,
      uri: data.uri,
      thumbnail: data.thumbnail,
      name: name || "Untitled Memory",
      description,
      createdAt: Date.now(),
    });
    closeModal();
    router.push(`/detail/${id}`);
  });

  const onSubmit = () => {
    // Zod Validation
    const result = videoMetadataSchema.safeParse({ name, description });
    if (!result.success) {
      const formatted = result.error.format();
      setErrors({
        name: formatted.name?._errors[0],
        description: formatted.description?._errors[0],
      });
      return;
    }

    if (selectedVideo && currentTrim) {
      setErrors({});
      handleTrim({
        uri: selectedVideo,
        startTime,
        endTime,
      });
    }
  };

  const btnScale = useSharedValue(1);
  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }));

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-[#0d0d12]"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={100}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 pt-6 gap-8">
          {/* VIDEO PREVIEW */}
          <Animated.View entering={FadeInDown.duration(400)} className="rounded-[32px] overflow-hidden border border-white/5 bg-black">
            <VideoPlayer uri={selectedVideo!} startTime={startTime} endTime={endTime} />
            <View className="absolute bottom-4 right-4 bg-black/70 px-4 py-1.5 rounded-2xl border border-white/10">
              <Text className="text-white text-[11px] font-black uppercase tracking-widest">
                {formatTime(startTime)} — {formatTime(endTime)}
              </Text>
            </View>
          </Animated.View>

          {/* METADATA FORM */}
          <Animated.View entering={FadeInDown.duration(400).delay(100)} className="bg-white/5 p-6 rounded-[32px] border border-white/5">
            <Text className="text-white/50 text-[10px] font-black uppercase tracking-[2px] mb-4 ml-1">Memory Info</Text>
            <MetadataForm
              name={name}
              setName={setName}
              description={description}
              setDescription={setDescription}
              errors={errors}
            />
          </Animated.View>
        </View>
      </ScrollView>

      {/* FOOTER ACTION */}
      <View className="px-5 pb-12 mb-4 pt-4 border-t border-white/5 bg-[#0d0d12]">
        <Animated.View style={btnStyle}>
          <Pressable
            onPress={onSubmit}
            onPressIn={() => (btnScale.value = withSpring(0.96))}
            onPressOut={() => (btnScale.value = withSpring(1))}
            disabled={isPending}
            className={`h-16 rounded-[24px] items-center justify-center shadow-2xl ${isPending ? 'bg-zinc-800' : 'bg-violet-600 shadow-violet-900/40'}`}
          >
            <Text className="text-white font-black text-base letter-spacing-[-0.5px]">
              {isPending ? "Generating Memory..." : "✨ Save to My Diary"}
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
};