
import { z } from "zod";

export const videoMetadataSchema = z.object({
  name: z.string().min(1, "Please enter a name"),
  description: z.string().min(1, "Please enter a description"),
});

export type VideoMetadata = z.infer<typeof videoMetadataSchema>;