import Post from '../models/post.model';
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import logger from "../logger.js";
import { uploadOnCloudinary, deleteCloudinaryImage } from "../utils/cloudinary.js";
import sharp from "sharp";
import path from "path";

//=====================ADD NEW POST=====================
const addNewPost = asyncHandler(async (req, res) => {
    try {
        const { caption, description } = req.body;
        const ImageLocalPath = req.files?.Image?.[0]?.path;

        if (!ImageLocalPath) {
            throw new ApiError(400, "Image is required.");
        }

        // Path for the optimized image
        const optimizedImagePath = path.join(
            path.dirname(ImageLocalPath),
            `optimized-${Date.now()}.jpeg`
        );

        // Optimize the image for Instagram (resize to 1080x1080 and compress)
        try {
            await sharp(ImageLocalPath)
                .resize(1080, 1080, { fit: "cover" })
                .jpeg({ quality: 80 })
                .toFile(optimizedImagePath);
        } catch (error) {
            throw new ApiError(500, "Error processing image with Sharp.");
        }

        let Image;
        try {
            // Upload optimized image to Cloudinary
            Image = await uploadOnCloudinary(optimizedImagePath);
            if (!Image?.secure_url) {
                throw new ApiError(500, "Failed to upload image to Cloudinary.");
            }
        } catch (error) {
            if (Image?.public_id) {
                await deleteCloudinaryImage(Image.public_id);
            }
            throw new ApiError(500, "Error uploading image to Cloudinary.");
        }

        const { _id: userId } = req.user;
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found.");
        }

        const post = await Post.create({
            author: user._id,
            caption: caption || "",
            description: description || "",
            image: Image.secure_url,
            likes: [],
            comments: [],
        });
        if (!post) {
            throw new ApiError(500, "Error while creating post.");
        }     

        await post.populate({ path: "author", select: "-password -refreshToken" }).execPopulate();
        
        await User.findByIdAndUpdate(userId, { $addToSet: { posts: post._id } });
        

        res.status(201).json(new ApiResponse(201, "Post created successfully", post));
    } catch (error) {
        logger.error(error.message);
        throw new ApiError(500, "Error while creating post");
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
        const {_id: userId} = req.user;
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
        await post.findByIdAndDelete();
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
        const comment = await Comment.create({ author: userId, text, post: postId }).populate({ path: "author", select: "username, avatar" });
        await comment.save();
        if (!comment) {
            throw new ApiError(500, "Error while adding comment");
        }

        await post.push({ comments: comment._id });
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
const deleteComment = asyncHandler(async (req, res) => {});





//=====================EXPORT FUNCTIONS=====================
export  {addNewPost, deletePost, LikeOrUnLikePost, addComment, deleteComment};
