import { View, Text, Pressable, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useVideoStore } from "@/store/videoStore";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect, useRef } from "react";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

export const Step1 = () => {
  const { setSelectedVideo, setStep } = useVideoStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const pickVideo = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      quality: 1,
    });

    if (result.canceled) return;

    if (isMounted.current) setIsProcessing(true);
    const uri = result.assets[0].uri;

    const t = setTimeout(() => {
        if (isMounted.current) {
            setSelectedVideo(uri);
            setStep(2);
        }
    }, 100);

    return () => clearTimeout(t);
  };

  return (
    <View className="flex-1 bg-[#0d0d12] justify-center px-6">
      {isProcessing ? (
        <Animated.View 
          entering={FadeIn} 
          exiting={FadeOut}
          className="items-center justify-center"
        >
          <View className="w-24 h-24 bg-violet-600/20 rounded-full items-center justify-center mb-6">
            <ActivityIndicator color="#7c3aed" size="large" />
          </View>
          <Text className="text-white text-xl font-black tracking-tight">Preparing Video</Text>
          <Text className="text-white/40 mt-2 text-sm font-medium">Getting your memory ready...</Text>
        </Animated.View>
      ) : (
        <Pressable
          onPress={pickVideo}
          style={({ pressed }) => ({
            opacity: pressed ? 0.8 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }]
          })}
          className="border-2 border-dashed border-white/10 rounded-[40px] py-16 items-center bg-white/5"
        >
          <View className="w-20 h-20 bg-violet-600 rounded-full items-center justify-center shadow-xl shadow-violet-900/40 mb-6">
            <Ionicons name="videocam" size={32} color="white" />
          </View>
          <Text className="text-white text-xl font-black tracking-tight">
            Select Video
          </Text>
          <Text className="text-white/40 mt-2 text-sm font-medium text-center px-6">
            Choose a video from your gallery to start editing
          </Text>
        </Pressable>
      )}
    </View>
  );
};