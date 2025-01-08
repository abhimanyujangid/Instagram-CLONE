import { Router } from 'express';
import { upload } from "../middlewares/multer.middleware.js";
import { registerUser,
    login,
    refreshAccessToken,
    logout,
    deactivateUser,
    reactivateAccount,
    updatePassword,
    getCurrentUser,
    getAllUsers,
    getUser,
    followOrUnfollowUser,
    forgotPassword,
    updateUserProfile } from '../controllers/user.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Public routes
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)
router.route('/login').post(login);
router.route('/refresh-access-token').get(refreshAccessToken);
router.route('/reactivate').post(reactivateAccount);


// Protected routes
router.route('/logout').post(verifyJWT,logout);
router.route('/deactivate').post(verifyJWT,deactivateUser);
router.route('/update-password').post(verifyJWT, updatePassword);
router.route('/current-user').get(verifyJWT, getCurrentUser);
router.route('/all-users').get(verifyJWT, getAllUsers);
router.route('/user/:userId').get(verifyJWT, getUser);
router.route('/follow/:userId').post(verifyJWT, followOrUnfollowUser);
// router.route('/forgot-password').post(forgotPassword);
router.route('/update-profile').post(verifyJWT, upload.fields([
    {
        name: "avatar",
        maxCount: 1
    },
    {
        name: "coverImage",
        maxCount: 1
    }
]), updateUserProfile);


export default router;