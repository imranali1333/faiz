"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videoController = void 0;
const postService_1 = require("../services/postService");
exports.videoController = {
    postVideon: async (req, res) => {
        const adminId = req.adminId;
        try {
            const { adminId, title, description, duration, releaseDate, genre, link } = req.body;
            if (!adminId || !title || !description || !duration || !genre || !link) {
                res.status(400).json({ message: 'All fields are required' });
                return;
            }
            const video = await postService_1.videoService.createVideo(adminId, title, description, duration, releaseDate, genre, link);
            res.status(201).json({ message: 'Video posted successfully', video });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to post video' });
        }
    },
    getAllVideos: async (req, res) => {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.items, 10) || 10;
        const skip = (page - 1) * limit;
        try {
            // Query the database for a list of all results with pagination and sorting
            const videosPromise = postService_1.videoService.getAllVideos({
                skip,
                take: limit,
                orderBy: {
                    createdAt: 'desc',
                },
            });
            // Counting the total documents
            const countPromise = postService_1.videoService.countVideos();
            // Resolving both promises
            const [videos, count] = await Promise.all([videosPromise, countPromise]);
            // Calculating total pages
            const pages = Math.ceil(count / limit);
            // Getting Pagination Object
            const pagination = { page, pages, count };
            if (count > 0) {
                res.status(200).json({
                    success: true,
                    result: videos,
                    pagination,
                    message: 'Successfully found all documents',
                });
            }
            else {
                res.status(203).json({
                    success: false,
                    result: [],
                    pagination,
                    message: 'Collection is empty',
                });
            }
        }
        catch (error) {
            console.error('Error fetching videos:', error);
            res.status(500).json({
                success: false,
                result: [],
                message: 'Oops, there is an error',
            });
        }
    },
};
