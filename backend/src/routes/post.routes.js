import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import {
    createPost,
    deletePost,
    LikeOrUnLikePost,
    addComment,
    getPostComments,
    deleteComment,
    bookmarkPost,
    getAllPosts,
    getUserPosts,
} from '../controllers/post.controller.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

// Protected routes with image upload 
router.route('/create-post').post(verifyJWT,
    upload.fields([{name: "image", maxCount: 1}]),createPost);

// Protected routes
router.route('/delete-post/:postId').delete(verifyJWT, deletePost);
router.route('/like-or-unlike-post/:postId').post(verifyJWT, LikeOrUnLikePost);
router.route('/add-comment/:postId').post(verifyJWT, addComment);
router.route('/get-comments/:postId').get(verifyJWT, getPostComments);
router.route('/delete-comment/:commentId').delete(verifyJWT, deleteComment);
router.route('/bookmark-post/:postId').post(verifyJWT, bookmarkPost);
router.route('/get-all-posts').get(verifyJWT, getAllPosts);
router.route('/get-user-posts').get(verifyJWT, getUserPosts);

export default router;