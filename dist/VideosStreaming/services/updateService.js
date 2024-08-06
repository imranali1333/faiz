"use strict";
// services/videoService.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoService = void 0;
const prismaclient_1 = __importDefault(require("../../utilities/prismaclient"));
class VideoService {
    // Existing methods...
    async updateVideo(videoId, adminId, title, description, duration, releaseDate, genre, link) {
        try {
            const video = await prismaclient_1.default.streaming.update({
                where: { id: videoId },
                data: {
                    title,
                    description,
                    // duration,
                    releaseDate,
                    genre,
                    link,
                    youtubevideos: {
                        create: {
                            authorId: adminId,
                            published: true,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                        }
                    }
                },
                include: {
                    youtubevideos: true
                }
            });
            return video;
        }
        catch (error) {
            throw new Error(`Failed to update video: ${error.message}`);
        }
    }
    async deleteVideo(videoId) {
        try {
            await prismaclient_1.default.streaming.delete({
                where: { id: videoId }
            });
            return { message: 'Video deleted successfully' };
        }
        catch (error) {
            throw new Error(`Failed to delete video: ${error.message}`);
        }
    }
}
exports.VideoService = VideoService;
