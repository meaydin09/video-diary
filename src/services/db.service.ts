import * as SQLite from "expo-sqlite";
import { VideoItem } from "@/types";

const DATABASE_NAME = "video_diary.db";


interface VideoRow extends Omit<VideoItem, 'isFavorite'> {
    isFavorite: number;
}

let db: SQLite.SQLiteDatabase | null = null;

export const DBService = {
    async init(instance?: SQLite.SQLiteDatabase): Promise<SQLite.SQLiteDatabase> {
        if (db && !instance) return db;

        db = instance || await SQLite.openDatabaseAsync(DATABASE_NAME);

        await db.execAsync(`
            PRAGMA journal_mode = WAL;
            CREATE TABLE IF NOT EXISTS videos (
                id TEXT PRIMARY KEY NOT NULL,
                uri TEXT NOT NULL,
                thumbnail TEXT,
                name TEXT NOT NULL,
                description TEXT,
                createdAt INTEGER NOT NULL,
                isFavorite INTEGER DEFAULT 0
            );
        `);

        return db;
    },

    async getAllVideos(): Promise<VideoItem[]> {
        const database = await this.init();

        const rows = await database.getAllAsync<VideoRow>("SELECT * FROM videos ORDER BY createdAt DESC");

        return rows.map((row: VideoRow) => ({
            ...row,
            isFavorite: row.isFavorite === 1,
        }));
    },

    async insertVideo(video: VideoItem) {
        const database = await this.init();
        await database.runAsync(
            "INSERT INTO videos (id, uri, thumbnail, name, description, createdAt, isFavorite) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
                video.id,
                video.uri,
                video.thumbnail || "",
                video.name,
                video.description || "",
                video.createdAt,
                video.isFavorite ? 1 : 0
            ]
        );
    },

    async updateVideo(id: string, data: Partial<VideoItem>) {
        const database = await this.init();
        const sets: string[] = [];
        const args: any[] = [];

        Object.entries(data).forEach(([key, value]) => {
            if (key === "id") return;
            sets.push(`${key} = ?`);
            args.push(key === "isFavorite" ? (value ? 1 : 0) : value);
        });

        if (sets.length === 0) return;

        args.push(id);
        await database.runAsync(
            `UPDATE videos SET ${sets.join(", ")} WHERE id = ?`,
            ...args
        );
    },

    async deleteVideo(id: string) {
        const database = await this.init();
        await database.runAsync("DELETE FROM videos WHERE id = ?", [id]);
    }
};