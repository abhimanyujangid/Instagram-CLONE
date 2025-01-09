import { Router } from 'express';
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { getMessages, sendMessage, } from '../controllers/message.controller.js';

const router = Router();

// Protected routes
router.route('/get-messages/:receiverId').post(verifyJWT, getMessages);
// Protected routes with image upload
router.route('/:receiverId').post(verifyJWT, upload.fields([{name: "image", maxCount: 1}]), sendMessage);


export default router;