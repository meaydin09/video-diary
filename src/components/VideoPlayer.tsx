import React, { useEffect, useRef } from "react";
import { DimensionValue, View } from "react-native";
import { VideoView, useVideoPlayer } from "expo-video";
import { useVideoStore } from "@/store/videoStore";
import { useIsFocused } from "@react-navigation/native";

interface Props {
  uri: string;
  startTime?: number;
  endTime?: number;
  height?: DimensionValue;
  className?: string;
  pauseWhenModalOpen?: boolean;
}

export const VideoPlayer = ({ uri, startTime = 0, endTime, height, className, pauseWhenModalOpen = false }: Props) => {
  const isModalOpen = useVideoStore(s => s.isModalOpen);
  const isFocused = useIsFocused();

  const player = useVideoPlayer(uri, (p) => {
    p.loop = !endTime;
  });

  // Oynatmayı kontrol et 
  useEffect(() => {
    if (player && isFocused && !isModalOpen) {
      player.play();
    }
    return () => {
      try {
        player.pause();
      } catch (e) {

      }
    };
  }, [player, isFocused, isModalOpen]);




  useEffect(() => {
    try {
      const shouldPause = (!isFocused) || (pauseWhenModalOpen && isModalOpen);
      if (shouldPause && player && player.playing) {
        player.pause();
      }
    } catch (e) { }
  }, [isFocused, isModalOpen, pauseWhenModalOpen, player]);


  useEffect(() => {
    if (!player || !endTime) return;

    const iv = setInterval(() => {
      try {

        const canPlay = isFocused && (!pauseWhenModalOpen || !isModalOpen);
        if (canPlay && player.playing && player.currentTime >= endTime - 0.05) {
          player.currentTime = startTime;
          player.play();
        }
      } catch (e) {
        clearInterval(iv);
      }
    }, 100);

    return () => clearInterval(iv);
  }, [player, startTime, endTime, isFocused, isModalOpen, pauseWhenModalOpen]);


  useEffect(() => {
    if (player && startTime > 0) {
      try {
        player.currentTime = startTime;
      } catch (e) { }
    }
  }, [player, startTime]);

  return (
    <View
      style={height ? { height } : {}}
      className={`w-full bg-black rounded-[30px] overflow-hidden shadow-xl ${!height ? 'aspect-video' : ''} ${className}`}
    >
      <VideoView
        player={player}
        style={{ width: "100%", height: "100%" }}
        contentFit="contain"
      />
    </View>
  );
};
