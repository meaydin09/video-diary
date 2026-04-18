export interface VideoItem {
  id: string;
  uri: string;
  thumbnail?: string;
  name: string;
  description?: string;
  createdAt: number;
  isFavorite?: boolean;
}