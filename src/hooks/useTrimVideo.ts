import { useMutation } from "@tanstack/react-query";
import * as VideoThumbnails from "expo-video-thumbnails";
import { trimVideo } from "expo-trim-video";

interface TrimParams {
  uri: string;
  startTime: number;
  endTime: number;
}

export const useTrimVideo = (onSuccess: (data: { uri: string; thumbnail: string }) => void) => {
  return useMutation({
    mutationFn: async ({ uri, startTime, endTime }: TrimParams) => {
      const trimmed = await trimVideo({
        uri: uri,
        start: startTime,
        end: endTime
      });

      const { uri: thumbnail } = await VideoThumbnails.getThumbnailAsync(
        trimmed.uri,
        { time: 0 }
      );

      return {
        uri: trimmed.uri,
        thumbnail
      };
    },
    onSuccess,
    onError: (err) => {
      console.error("Kırpma hatası kanka:", err);
    },
  });
};