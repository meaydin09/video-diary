import { create } from "zustand";
import { VideoItem } from "@/types";
import { DBService } from "@/services/db.service";

interface TrimRange {
  startTime: number;
  endTime: number;
}

interface VideoState {
  videos: VideoItem[];
  isModalOpen: boolean;
  step: 1 | 2 | 3;
  selectedVideo: string | null;
  currentTrim: TrimRange | null;

  // Actions
  loadVideos: () => Promise<void>;
  addVideo: (video: VideoItem) => Promise<void>;
  removeVideo: (id: string) => Promise<void>;
  updateVideo: (id: string, data: Partial<VideoItem>) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;

  openModal: () => void;
  closeModal: () => void;
  setStep: (step: 1 | 2 | 3) => void;
  setSelectedVideo: (uri: string | null) => void;
  setCurrentTrim: (trim: TrimRange) => void;
}

export const useVideoStore = create<VideoState>((set, get) => ({
  videos: [],
  isModalOpen: false,
  step: 1,
  selectedVideo: null,
  currentTrim: null,

  loadVideos: async () => {
    try {
      const videos = await DBService.getAllVideos();
      set({ videos });
    } catch (error) {
      console.error("Videolar yüklenirken hata oluştu kanka:", error);
    }
  },

  addVideo: async (video) => {
    try {
      await DBService.insertVideo(video);
      set((state) => ({ videos: [video, ...state.videos] }));
    } catch (error) {
      console.error("Video eklenirken hata:", error);
    }
  },

  removeVideo: async (id) => {
    try {
      await DBService.deleteVideo(id);
      set((state) => ({
        videos: state.videos.filter((v) => v.id !== id),
      }));
    } catch (error) {
      console.error("Video silinirken hata:", error);
    }
  },

  updateVideo: async (id, data) => {
    try {
      await DBService.updateVideo(id, data);
      set((state) => ({
        videos: state.videos.map((v) => (v.id === id ? { ...v, ...data } : v)),
      }));
    } catch (error) {
      console.error("Video güncellenirken hata:", error);
    }
  },

  toggleFavorite: async (id) => {
    const video = get().videos.find(v => v.id === id);
    if (!video) return;

    const newStatus = !video.isFavorite;
    try {
      await DBService.updateVideo(id, { isFavorite: newStatus });
      set((state) => ({
        videos: state.videos.map((v) =>
          v.id === id ? { ...v, isFavorite: newStatus } : v
        ),
      }));
    } catch (error) {
      console.error("Favori güncellenirken hata:", error);
    }
  },

  // UI Actions 
  openModal: () => set({ isModalOpen: true, step: 1 }),
  closeModal: () => set({ isModalOpen: false, selectedVideo: null, step: 1, currentTrim: null }),
  setStep: (step) => set({ step }),
  setSelectedVideo: (uri) => set({ selectedVideo: uri }),
  setCurrentTrim: (trim) => set({ currentTrim: trim }),
}));
