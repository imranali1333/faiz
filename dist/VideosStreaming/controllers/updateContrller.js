"use strict";
// src/controllers/videoController.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVideo = void 0;
const postService_1 = require("../services/postService");
const videoService = new postService_1.VideoService();
const updateVideo = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body; // Data to update
    try {
        const video = await videoService.updateVideo(Number(id), updateData);
        res.status(200).json({
            success: true,
            result: video,
            message: `We updated this document by this id: ${id}`,
        });
    }
    catch (error) {
        console.error('Error updating video:', error);
        if (error.message.includes('Failed to update video')) {
            res.status(400).json({
                success: false,
                result: null,
                message: "Required fields are not supplied or invalid data provided",
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
exports.updateVideo = updateVideo;
