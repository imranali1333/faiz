"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoController = void 0;
const updateService_1 = require("../services/updateService");
const videoService = new updateService_1.VideoService();
exports.videoController = {
    // Existing methods...
    updateVideo: async (req, res) => {
        try {
            const { videoId, adminId, title, description, duration, releaseDate, genre, link } = req.body;
            if (!videoId || !adminId || !title || !description || !duration || !releaseDate || !genre || !link) {
                res.status(400).json({ message: 'All fields are required' });
                return;
            }
            const video = await videoService.updateVideo(videoId, adminId, title, description, duration, new Date(releaseDate), genre, link);
            res.status(200).json({ message: 'Video updated successfully', video });
        }
        catch (error) {
            console.error('Error in updateVideo:', error);
            res.status(500).json({ message: `Failed to update video: ${error.message}` });
        }
    },
    deleteVideo: async (req, res) => {
        try {
            const { videoId } = req.body;
            if (!videoId) {
                res.status(400).json({ message: 'Video ID is required' });
                return;
            }
            const result = await videoService.deleteVideo(videoId);
            res.status(200).json(result);
        }
        catch (error) {
            console.error('Error in deleteVideo:', error);
            res.status(500).json({ message: `Failed to delete video: ${error.message}` });
        }
    }
};
