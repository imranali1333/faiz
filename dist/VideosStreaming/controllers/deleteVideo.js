"use strict";
// src/controllers/videoController.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVideo = void 0;
const postService_1 = require("../services/postService");
const videoService = new postService_1.VideoService();
const deleteVideo = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedVideo = await videoService.deleteVideo(Number(id));
        res.status(200).json({
            success: true,
            result: deletedVideo,
            message: `Successfully deleted document by this id: ${id}`,
        });
    }
    catch (error) {
        console.error('Error deleting video:', error);
        if (error.message.includes('Failed to delete video')) {
            res.status(404).json({
                success: false,
                result: null,
                message: `No document found with id: ${id}`,
            });
        }
        else {
            res.status(500).json({
                success: false,
                result: null,
                message: `Oops, there is an error: ${error.message}`,
            });
        }
    }
};
exports.deleteVideo = deleteVideo;
