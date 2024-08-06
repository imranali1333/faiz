"use strict";
// src/services/videoService.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoService = exports.VideoService = void 0;
const prismaclient_1 = __importDefault(require("../../utilities/prismaclient"));
class VideoService {
    async createVideo(adminId, title, description, duration, releaseDate, genre, link) {
        try {
            const video = await prismaclient_1.default.streaming.create({
                data: {
                    title,
                    description,
                    duration,
                    genre,
                    link,
                    youtubevideos: {
                        create: {
                            authorId: adminId,
                            published: true,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        },
                    },
                },
                include: {
                    youtubevideos: true,
                },
            });
            return video;
        }
        catch (error) {
            throw new Error(`Failed to create video: ${error.message}`);
        }
    }
    async getAllVideos(options) {
        try {
            return await prismaclient_1.default.streaming.findMany({
                skip: options.skip,
                take: options.take,
                orderBy: {
                    createdAt: options.orderBy.createdAt,
                },
                include: {
                    youtubevideos: true,
                },
            });
        }
        catch (error) {
            throw new Error(`Failed to fetch videos: ${error.message}`);
        }
    }
    async countVideos() {
        try {
            return await prismaclient_1.default.streaming.count();
        }
        catch (error) {
            throw new Error(`Failed to count videos: ${error.message}`);
        }
    }
    async getVideoById(id) {
        try {
            const video = await prismaclient_1.default.streaming.findUnique({
                where: { id },
                include: {
                    youtubevideos: true,
                },
            });
            if (!video) {
                throw new Error(`No video found with ID: ${id}`);
            }
            return video;
        }
        catch (error) {
            throw new Error(`Failed to fetch video by ID: ${error.message}`);
        }
    }
    async searchVideos(query, fields) {
        try {
            const searchCriteria = {
                OR: fields.map(field => ({
                    [field]: {
                        contains: query,
                        mode: 'insensitive',
                    },
                })),
            };
            const videos = await prismaclient_1.default.streaming.findMany({
                where: searchCriteria,
                include: {
                    youtubevideos: true,
                },
                orderBy: { title: 'asc' },
                take: 10,
            });
            return videos;
        }
        catch (error) {
            throw new Error(`Failed to search videos: ${error.message}`);
        }
    }
    async updateVideo(id, data) {
        try {
            const video = await prismaclient_1.default.streaming.update({
                where: { id },
                data,
                include: {
                    youtubevideos: true, // Include related data if necessary
                },
            });
            return video;
        }
        catch (error) {
            throw new Error(`Failed to update video: ${error.message}`);
        }
    }
    async deleteVideo(id) {
        try {
            const deletedVideo = await prismaclient_1.default.streaming.delete({
                where: { id },
                include: {
                    youtubevideos: true, // Include related data if necessary
                },
            });
            return deletedVideo;
        }
        catch (error) {
            throw new Error(`Failed to delete video: ${error.message}`);
        }
    }
}
exports.VideoService = VideoService;
exports.videoService = new VideoService();
