import Post from '../models/post.models.js';
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import logger from "../logger.js";
import { uploadOnCloudinary, deleteCloudinaryImage } from "../utils/cloudinary.js";
import sharp from "sharp";
import path from "path";
import Comment from '../models/comment.model.js';

//=====================create NEW POST=====================
const createPost = asyncHandler(async (req, res) => {
    try {
        const { caption, description } = req.body;
        const imageLocalPath = req.files?.image?.[0]?.path;

        if (!imageLocalPath) {
            throw new ApiError(400, "Image is required.");
        }

        let image;

        try {
            // Upload the image to Cloudinary
            image = await uploadOnCloudinary(imageLocalPath);
            if (!image?.secure_url) {
                throw new ApiError(500, "Failed to upload image to Cloudinary.");
            }
        } catch (error) {
            throw new ApiError(500, "Error uploading image to Cloudinary.");
        }

        const { _id: userId } = req.user;
        const user = await User.findById(userId);

        if (!user) {
            // Cleanup Cloudinary image if user is not found
            if (image?.public_id) {
                await deleteCloudinaryImage(image.public_id);
            }
            throw new ApiError(404, "User not found.");
        }

        const post = await Post.create({
            author: user._id,
            caption: caption || "",
            description: description || "",
            image: image.secure_url,
            likes: [],
            comments: [],
        });

        if (!post) {
            // Cleanup Cloudinary image if post creation fails
            if (image?.public_id) {
                await deleteCloudinaryImage(image.public_id);
            }
            throw new ApiError(500, "Error while creating post.");
        }

        // Populate the post author field
        await post.populate({ path: "author", select: "username avatar" });

        // Add the post ID to the user's posts array
        const updatedUser = await User.findByIdAndUpdate(userId, { $addToSet: { posts: post._id } });

        res.status(201).json(new ApiResponse(201, "Post created successfully", updatedUser));
    } catch (error) {
        logger.error(error.message);

        // Cleanup Cloudinary image in case of any error
        if (image?.public_id) {
            await deleteCloudinaryImage(image.public_id);
        }

        throw new ApiError(500, "Error while creating post.");
    }
});

//=====================GET ALL POSTS=====================
const getAllPosts = asyncHandler(async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 })
        .populate({ path: "author", select: "username, avatar" })
        .populate({ path: "comments",sort: { createdAt: -1 }, populate: { path: "author", select: "username, avatar" } });
        res.status(200).json(new ApiResponse(200, "All posts", posts));
    } catch (error) {
        throw new ApiError(500, "Error while fetching posts");
    }
});
//=====================GET USER POSTS=====================
const getUserPosts = asyncHandler(async (req, res) => {
    try {
        const {userId} = req.params;
        if(!userId){
            throw new ApiError(404, "User not found.");
        }
        const posts = await Post.find({ author: userId }).sort({ createdAt: -1 })
        .populate({ path: "author", select: "username, avatar" })
        .populate({ path: "comments",sort: { createdAt: -1 }, populate: { path: "author", select: "username, avatar" } });
        res.status(200).json(new ApiResponse(200, "User posts", posts));
    } catch (error) {
        throw new ApiError(500, "Error while fetching posts");
    }
});
//=====================DELETE POST=====================
const deletePost = asyncHandler(async (req, res) => {
    try {
        const { _id: userId } = req.user;
        const { postId } = req.params;
        const post = await Post.findById(postId);
        if (!post) {
            throw new ApiError(404, "Post not found.");
        }
        if (post.author.toString() !== userId) {
            throw new ApiError(403, "You are not authorized to delete this post.");
        }
        await post.deleteOne();
        await User.findByIdAndUpdate(userId, { $pull: { posts: post._id }, $pull: { bookmarks: post._id }}, { new: true });
        await Comment.deleteMany({ post: post._id });

        res.status(200).json(new ApiResponse(200, "Post deleted successfully"));
    } catch (error) {
        throw new ApiError(500, "Error while deleting post");
    }
});
//=====================LIKE OR UNLIKE POST=====================
const LikeOrUnLikePost = asyncHandler(async (req, res) => {
    try {
        const { postId } = req.params;
        const { _id: userId } = req.user;
        const post = await Post.findById(postId);
        if (!post) {
            throw new ApiError(404, "Post not found.");}
        if (post.likes.includes(userId)) {
            await post.updateOne({ $pull: { likes: userId } });
            await post.save();
            //Make for socket io

            res.status(200).json(new ApiResponse(200, "Post unliked "));
        }
        else {
            await post.updateOne({ $addToSet: { likes: userId } });
            await post.save();
            //Make for socket io
            res.status(200).json(new ApiResponse(200, "Post liked "));
        }
    } catch (error) {
        throw new ApiError(500, "Error while liking/unliking post");
    }
});
//=====================ADD COMMENT=====================
const addComment = asyncHandler(async (req, res) => {
    try {
        const { postId } = req.params;
        const { _id: userId } = req.user;
        const { text } = req.body;
        const post = await Post.findById(postId);
        if (!post) {
            throw new ApiError(404, "Post not found.");
        }
        const comment = await Comment.create({ author: userId, text, post: postId });
        await comment.populate({ path: "author", select: "username, avatar" });

        if (!comment) {
            throw new ApiError(500, "Error while adding comment it not found.");
        }
        await post.updateOne({ $push: { comments: comment._id } });
        await post.save();
        res.status(200).json(new ApiResponse(200, "Comment added successfully"));
    } catch (error) {
        throw new ApiError(500, "Error while adding comment");
        
    }
});
//=====================GET POST COMMENTS===================
const getPostComments = asyncHandler(async (req, res) => {
    try {
        const { postId } = req.params;
        const post = await Post.findById(postId).populate({ path: "comments", populate: { path: "author", select: "username, avatar" } });
        if (!post) {
            throw new ApiError(404, "Post not found.");
        }
        res.status(200).json(new ApiResponse(200, "Post comments", post.comments));
    } catch (error) {
        throw new ApiError(500, "Error while fetching comments");
    }
});
//=====================DELETE COMMENT=====================
const deleteComment = asyncHandler(async (req, res) => {
    try {
        const { _id: userId } = req.user;
        const { commentId } = req.params;
        const comment = await Comment.findOneAndDelete({ _id: commentId, author: userId });
        if (!comment) {
            throw new ApiError(404, "Comment not found or unauthorized to delete.");
        }
        await Post.findByIdAndUpdate(comment.post, { $pull: { comments: comment._id } });
        return res.status(200).json(new ApiResponse(200, "Comment deleted successfully"));
    } catch (error) {
        if (error.name === "CastError") {
            throw new ApiError(400, "Comment ID is invalid.");
        }
        throw new ApiError(500, "Error while deleting comment");
    }
});
//=====================BOOKMARK POST=====================
const bookmarkPost = asyncHandler(async (req, res) => {
    try {
        const { postId } = req.params;
        const { _id: userId } = req.user;
        const post = await Post.findById(postId);
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found.");
        }
        if (!post) {
            throw new ApiError(404, "Post not found.");
        }
        if (user.bookmarks.includes(postId)) {
            await user.updateOne({ $pull: { bookmarks: postId } });
            await user.save();
            return res.status(200).json(new ApiResponse(200, "Post unBookmarked successfully"));
        }
        else {
            await user.updateOne({ $addToSet: { bookmarks: postId } });
            await user.save();
            return res.status(200).json(new ApiResponse(200, "Post Bookmarked successfully"));

        }
    } catch (error) {
        throw new ApiError(500, "Error while bookmarking post");
        
    }
});





//=====================EXPORT FUNCTIONS=====================
export {
    createPost,
    deletePost,
    LikeOrUnLikePost,
    addComment,
    getPostComments,
    deleteComment,
    bookmarkPost,
    getAllPosts,
    getUserPosts
};

