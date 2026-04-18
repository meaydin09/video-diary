import React, { useCallback, useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  LayoutChangeEvent,
  Image,
} from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { useVideoStore } from "@/store/videoStore";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { getThumbnailAsync } from "expo-video-thumbnails";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  clamp,
  FadeIn,
} from "react-native-reanimated";
import { useRef } from "react";
const TRIM_DURATION = 5;
const TRACK_H = 60;
const THUMB_COUNT = 12;
const MIN_WIN_W = 40;

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export const Step2 = () => {
  const { selectedVideo, setStep, setCurrentTrim, isModalOpen } = useVideoStore();

  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [trackWidth, setTrackWidth] = useState(0);
  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  const endTime = Math.min(startTime + TRIM_DURATION, duration);

  const windowLeft = useSharedValue(0);
  const dragBase = useSharedValue(0);

  const onTrackLayout = (e: LayoutChangeEvent) =>
    setTrackWidth(e.nativeEvent.layout.width);

  useEffect(() => {
    if (!selectedVideo || duration <= 0) return;
    const generate = async () => {
      const frames: string[] = [];
      for (let i = 0; i < THUMB_COUNT; i++) {
        const timeMs = Math.floor((i / (THUMB_COUNT - 1)) * duration * 1000);
        try {
          const { uri } = await getThumbnailAsync(selectedVideo, {
            time: timeMs,
            quality: 0.3,
          });
          frames.push(uri);
        } catch {
          frames.push("");
        }
      }
      setThumbnails(frames);
    };
    generate();
  }, [selectedVideo, duration]);

  const pxToStart = useCallback(
    (px: number) => {
      if (trackWidth <= 0 || duration <= 0) return;
      const rawW = (TRIM_DURATION / duration) * trackWidth;
      const winW = Math.max(rawW, MIN_WIN_W);
      const maxLeft = trackWidth - winW;
      const clamped = Math.max(0, Math.min(px, maxLeft));
      const maxStart = Math.max(0, duration - TRIM_DURATION);
      const newStart = maxLeft > 0 ? (clamped / maxLeft) * maxStart : 0;
      setStartTime(Math.round(newStart * 10) / 10);
    },
    [trackWidth, duration]
  );

  const windowGesture = Gesture.Pan()
    .activeOffsetX([-5, 5])
    .failOffsetY([-15, 15])
    .onBegin(() => {
      dragBase.value = windowLeft.value;
    })
    .onUpdate((e) => {
      if (trackWidth <= 0 || duration <= 0) return;
      const rawW = (TRIM_DURATION / duration) * trackWidth;
      const winW = Math.max(rawW, MIN_WIN_W);
      const maxLeft = trackWidth - winW;
      const next = clamp(dragBase.value + e.translationX, 0, maxLeft);
      windowLeft.value = next;
      runOnJS(pxToStart)(next);
    });

  const windowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: windowLeft.value }],
  }));

  const winW =
    trackWidth > 0 && duration > 0
      ? Math.max((TRIM_DURATION / duration) * trackWidth, MIN_WIN_W)
      : 0;

  const player = useVideoPlayer(selectedVideo!, (p) => {
    p.loop = false;
  });


  useEffect(() => {
    if (player && isModalOpen) {
      player.play();
    }
    return () => {
      try {
        player.pause();
      } catch (e) { }
    };
  }, [player, isModalOpen]);



  // Modal kapandığında player susturma
  useEffect(() => {
    try {
      if (!isModalOpen && player && player.playing) {
        player.pause();
      }
    } catch (e) { }
  }, [isModalOpen, player]);


  useEffect(() => {
    const iv = setInterval(() => {
      try {
        const d = player?.duration;
        if (d && d > 0 && isMounted.current) {
          setDuration(d);
          clearInterval(iv);
        }
      } catch (e) {
        clearInterval(iv);
      }
    }, 200);
    return () => clearInterval(iv);
  }, [player]);

  useEffect(() => {
    // Sadece modal açıksa ve süre belirlenmişse oynatmayı tazele
    if (player && duration > 0 && isModalOpen) {
      try {
        player.currentTime = startTime;
        player.play();
      } catch (e) { }
    }
  }, [player, startTime, duration, isModalOpen]);

  useEffect(() => {
    if (!player || duration === 0) return;
    const iv = setInterval(() => {
      try {
        //Modal kapalı iken oynatmama
        if (isModalOpen && player.playing && player.currentTime >= endTime - 0.05) {
          player.currentTime = startTime;
          player.play();
        }
      } catch (e) {
        clearInterval(iv);
      }
    }, 50);
    return () => clearInterval(iv);
  }, [player, startTime, endTime, duration, isModalOpen]);

  return (
    <View className="flex-1 bg-[#0d0d12] px-5 pt-8">
      {/* VIDEO */}
      <View className="rounded-3xl overflow-hidden bg-black mb-8 border border-white/5 shadow-2xl">
        <VideoView player={player} style={{ width: "100%", height: 220 }} contentFit="contain" />
      </View>

      {/* TIMELINE */}
      {duration > 0 ? (
        <View className="bg-white/5 p-4 rounded-3xl border border-white/5">
          <View className="flex-row justify-between mb-4">
            <Text className="text-white/40 font-bold text-xs">{fmt(startTime)}</Text>
            <View className="bg-yellow-500/10 px-3 py-1 rounded-full">
              <Text className="text-yellow-500 font-black text-xs">
                {fmt(startTime)} → {fmt(endTime)}
              </Text>
            </View>
            <Text className="text-white/40 font-bold text-xs">{fmt(duration)}</Text>
          </View>

          <View
            onLayout={onTrackLayout}
            style={{ height: TRACK_H }}
            className="bg-zinc-900/50 rounded-2xl overflow-hidden flex-row border border-white/5"
          >
            {Array.from({ length: THUMB_COUNT }).map((_, i) => (
              <View
                key={i}
                style={{ flex: 1, marginRight: i < THUMB_COUNT - 1 ? 1 : 0 }}
              >
                {thumbnails[i] ? (
                  <Image
                    source={{ uri: thumbnails[i] }}
                    style={{ width: "100%", height: "100%", opacity: 0.6 }}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: i % 2 ? "rgba(255,255,255,0.05)" : "transparent",
                    }}
                  />
                )}
              </View>
            ))}

            {winW > 0 && (
              <GestureDetector gesture={windowGesture}>
                <Animated.View
                  style={[
                    {
                      position: "absolute",
                      height: "100%",
                      width: winW,
                      borderWidth: 3,
                      borderColor: "#f59e0b",
                      borderRadius: 14,
                      backgroundColor: "rgba(245, 158, 11, 0.15)",
                    },
                    windowStyle,
                  ]}
                >

                  <View className="absolute left-1 top-1/2 -translate-y-2 w-1 h-4 bg-white/40 rounded-full" />
                  <View className="absolute right-1 top-1/2 -translate-y-2 w-1 h-4 bg-white/40 rounded-full" />
                </Animated.View>
              </GestureDetector>
            )}
          </View>
          <Text className="text-white/30 text-[10px] text-center mt-3 font-medium uppercase tracking-widest">
            Drag to select 5 seconds
          </Text>
        </View>
      ) : (
        <View className="flex-1 items-center justify-center px-10">
          <Animated.View
            entering={FadeIn.duration(800)}
            className="w-full bg-white/5 border border-white/5 rounded-[40px] p-10 items-center"
          >
            <View className="w-20 h-20 bg-violet-600/20 rounded-full items-center justify-center mb-8">
              <ActivityIndicator color="#7c3aed" size="large" />
            </View>
            <Text className="text-[#e3e0f1] text-xl font-black text-center tracking-tight">
              Analyzing Memory
            </Text>
            <Text className="text-[#ccc3d8]/40 mt-3 text-sm font-medium text-center leading-relaxed">
              Generating cinematic thumbnails and preparing your workspace...
            </Text>
          </Animated.View>
        </View>
      )}


      <View className="mt-auto pb-16">
        <Pressable
          onPress={() => {
            setCurrentTrim({ startTime, endTime });
            setStep(3);
          }}
          style={({ pressed }) => ({
            backgroundColor: pressed ? "#6d28d9" : "#7c3aed",
            transform: [{ scale: pressed ? 0.98 : 1 }]
          })}
          className="h-16 rounded-3xl items-center justify-center shadow-lg shadow-violet-900/20"
        >
          <Text className="text-white font-black text-base">Continue to Finalize →</Text>
        </Pressable>
      </View>
    </View>
  );
};