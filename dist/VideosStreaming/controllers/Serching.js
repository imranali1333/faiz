"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchVideos = exports.getVideoById = void 0;
const postService_1 = require("../services/postService");
const getVideoById = async (req, res) => {
    const { id } = req.params;
    try {
        const video = await postService_1.videoService.getVideoById(Number(id));
        res.status(200).json({
            success: true,
            result: video,
            message: `We found this document by this id: ${id}`,
        });
    }
    catch (error) {
        console.error('Error fetching video by ID:', error);
        res.status(500).json({
            success: false,
            result: null,
            message: `Oops, there is an error: ${error.message}`,
        });
    }
};
exports.getVideoById = getVideoById;
const searchVideos = async (req, res) => {
    const query = req.query.q;
    const fieldsString = req.query.fields;
    if (!query || !fieldsString || query.trim() === '') {
        res.status(202).json({
            success: false,
            result: [],
            message: "No document found by this request",
        });
        return; // Explicitly return void
    }
    const fieldsArray = fieldsString.split(',');
    try {
        const videos = await postService_1.videoService.searchVideos(query, fieldsArray);
        if (videos.length > 0) {
            res.status(200).json({
                success: true,
                result: videos,
                message: "Successfully found all documents",
            });
        }
        else {
            res.status(202).json({
                success: false,
                result: [],
                message: "No document found by this request",
            });
        }
    }
    catch (error) {
        console.error('Error searching for videos:', error);
        res.status(500).json({
            success: false,
            result: null,
            message: `Oops, there is an error: ${error.message}`,
        });
    }
};
exports.searchVideos = searchVideos;
