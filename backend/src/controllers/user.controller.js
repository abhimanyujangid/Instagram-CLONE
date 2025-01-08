import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import logger from "../logger.js";
import { uploadOnCloudinary, deleteCloudinaryImage } from "../utils/cloudinary.js";
import Post from "../models/post.models.js";

//===============GENERATE ACCESS TOKEN & REFRESH TOKEN=====
const generateAccessAndRefreshToken = async (userId) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new ApiError(404, "User not found."); 
      }
      const accessToken = user.generateAccessToken();
      logger.info(`Access token generated for user: ${user._id}`);
      const refreshToken = user.generateRefreshToken();
  
      // Save the refresh token to the user
      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });
  
      return { accessToken, refreshToken };
    } catch (error) {
      console.error("Error generating tokens:", error);
      throw new ApiError(500, "Error generating access and refresh tokens.");
    }
  };
//=====================REGISTER USER=====================
const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, password, username } = req.body;

    // Validate required fields
    if ([fullName, email, password, username].some(field => !field)) {
        throw new ApiError(400, "Please provide all required fields.");
    }

    // Check for existing user
    const existingUser = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (existingUser) {
        return res.status(400).json(new ApiResponse(400,  "User already exists"));
    }

    // Initialize avatar and coverImage variables
    let avatar, coverImage;

    // Handle avatar upload if provided
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    if (avatarLocalPath) {
        try {
            avatar = await uploadOnCloudinary(avatarLocalPath);
            if (!avatar?.secure_url) {
                throw new ApiError(500, "Failed to upload avatar image to Cloudinary.");
            }
        } catch (error) {
            throw new ApiError(500, "Error uploading avatar image to Cloudinary.");
        }
    }

    // Handle cover image upload if provided
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
    if (coverImageLocalPath) {
        try {
            coverImage = await uploadOnCloudinary(coverImageLocalPath);
            if (!coverImage?.secure_url) {
                throw new ApiError(500, "Failed to upload cover image to Cloudinary.");
            }
        } catch (error) {
            // Clean up avatar if already uploaded
            if (avatar?.public_id) {
                await deleteCloudinaryImage(avatar.public_id);
            }
            throw new ApiError(500, "Error uploading cover image to Cloudinary.");
        }
    }

    try {
        // Create user with optional images
        const user = await User.create({
            fullName,
            email,
            password,
            username: username.toLowerCase(),
            avatar: avatar?.secure_url || "", 
            coverImage: coverImage?.secure_url || "" 
        });

        const createdUser = await User.findById(user._id).select("-password -refreshToken");

        if (!createdUser) {
            // Clean up uploaded images if user creation fails
            if (avatar?.public_id) {
                await deleteCloudinaryImage(avatar.public_id);
            }
            if (coverImage?.public_id) {
                await deleteCloudinaryImage(coverImage.public_id);
            }
            throw new ApiError(500, "User creation failed.");
        }

        return res.status(201).json(
            new ApiResponse(201, createdUser, "User created successfully")
        );

    } catch (error) {
        // Clean up any uploaded images if there's an error
        if (avatar?.public_id) {
            await deleteCloudinaryImage(avatar.public_id);
        }
        if (coverImage?.public_id) {
            await deleteCloudinaryImage(coverImage.public_id);
        }
        throw new ApiError(500, "User registration failed.");
    }
});

//=====================LOGIN USER=====================
const login = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    if ([username, email, password].some(field => !field)) {
        throw new ApiError(400, "Please provide all required fields.");
    }
    const user = await User.findOne({
        $or: [{ username: username.toLowerCase() }, { email: email.toLowerCase() },{ isActive: true }]
    });
    if (!user) {
        throw new ApiError(404, "User not found.");
    }

    if (!await user.isPasswordCorrect(password)) {
        throw new ApiError(401, "Incorrect password.");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    if (!loggedInUser) {
        throw new ApiError(500, "User not found.");
    }
    const options =
    {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    };

    res
        .status(200)
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json(new ApiResponse(200, `Welcome back ${user.fullName}`, loggedInUser));
});
//=====================REFRESH ACCESS TOKEN===============
const refreshAccessToken = asyncHandler(async (req, res) => {
    const { incomingRefreshToken } = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Refresh token not found.");
    }
    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        if (!decodedToken) {
            throw new ApiError(401, "Invalid refresh token.");
        }
        const user = await User.findById(decodedToken?._id);
        if (!user) {
            throw new ApiError(404, "Invalid user Refresh token.");
        }
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Invalid refresh token.");
        }
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        };
        const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshToken(user._id);
        return res
            .status(200)
            .cookie('accessToken', accessToken, options)
            .cookie('refreshToken', newRefreshToken, options)
            .json(new ApiResponse(200,
                    {
                        accessToken, 
                        refreshToken: newRefreshToken
                    }, "Access token refreshed successfully."));

    } catch (error) {
        throw new ApiError(500, "Error refreshing access token.");
    }
});
//=====================LOGOUT USER=====================
const logout = asyncHandler(async (req, res) => {
    const { _id: userId } = req.user; 

    if (!userId) {
        throw new ApiError(400, "User ID is required.");
    }
        await User.findByIdAndUpdate(userId,
        {
            $set: { refreshToken: undefined }
        },{
            new: true,
        }
    );

    

    // Clear the cookies from the client
    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
    }
    res
        .status(200)
        .clearCookie('accessToken',options)
        .clearCookie('refreshToken',options)
        .json(new ApiResponse(200,{}, "User logged out successfully."));
});
//=====================FORGOT PASSWORD=====================
const forgotPassword = asyncHandler(async (req, res) => { });

//=====================updateAccountDetails=====================  
const updateUserProfile = asyncHandler(async (req, res) => {
    const { fullName, email, username, bio, gender } = req.body;
    const { _id: userId } = req.user;

    if (!userId) {
        throw new ApiError(400, "User ID is required.");
    }

    const updateObj = {};

    // Handle file uploads
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    if (avatarLocalPath) {
        try {
            const avatar = await uploadOnCloudinary(avatarLocalPath);
            if (!avatar?.secure_url) {
                throw new ApiError(400, "Avatar upload failed. Please try again.");
            }
            updateObj.avatar = avatar.secure_url;
        } catch (error) {
            throw new ApiError(
                500, 
                error.message || "Error uploading avatar image. Please try again."
            );
        }
    }

    if (coverImageLocalPath) {
        try {
            const coverImage = await uploadOnCloudinary(coverImageLocalPath);
            if (!coverImage?.secure_url) {
                throw new Error("Error uploading cover image.");
            }
            updateObj.coverImage = coverImage.secure_url;
        } catch (error) {
            throw new ApiError(500, "Error uploading cover image.");
        }
    }

    // Update other fields if provided
    if (fullName) {
        updateObj.fullName = fullName;
    }
    if (bio) {
        updateObj.bio = bio;
    }
    if (gender) {
        updateObj.gender = gender;
    }

    // Validate and update email
    if (email) {
        const existingEmail = await User.findOne({ email });
        if (existingEmail && existingEmail?._id.toString() !== userId) {
            throw new ApiError(400, "Email already exists.");
        }
        updateObj.email = email;
    }

    // Validate and update username
    if (username) {
        const existingUsername = await User.findOne({ username });
        if (existingUsername && existingUsername?._id.toString() !== userId) {
            throw new ApiError(400, "Username already exists.");
        }
        updateObj.username = username;
    }

    // Find and update the user
    const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateObj },
        { new: true, runValidators: true }
    ).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(404, "User not found.");
    }

    res.status(200).json(new ApiResponse(200, user, "User profile updated successfully."));
});

//=====================UPDATE PASSWORD=====================
const updatePassword = asyncHandler(async (req, res) => {
    const {  oldPassword, newPassword } = req.body;
    if([ oldPassword, newPassword].some(field => !field)) {
        throw new ApiError(400, "Please provide all required fields.");
    }
    const { _id: userId } = req.user; 
    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found.");
    }

    const isOldPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isOldPasswordCorrect) {
        throw new ApiError(401, "Old password is incorrect.");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    res.status(200).json(new ApiResponse(200, {},"Password updated successfully."));
});

//=====================Deactivate USER=====================
const deactivateUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user?._id);
   if (!user) {
         throw new ApiError(404, "User not found.");
   }
    user.isActive = false;
    await user.save({ validateBeforeSave: false });
    res.status(200).json(new ApiResponse(200, "Account deactivated successfully."));
});
//=====================REACTIVATE ACCOUNT=====================
const reactivateAccount = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        throw new ApiError(400, "User ID is required.");
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found.");
    }

    if (user.isActive) {
        throw new ApiError(400, "Account is already active.");
    }

    user.isActive = true;
    await user.save({ validateBeforeSave: false });

    res.status(200).json(new ApiResponse(200, "Account reactivated successfully."));
});
//=====================GET CURRENT USER=====================
const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200).json(new ApiResponse(200, req.user,"User fetched successfully", req.user));
});
//=====================GET USERS=====================
const getAllUsers = asyncHandler(async (req, res) => {
    const {_id: userId} = req.user;
    const users = await User.find({ _id: { $ne: userId } }).select("-password -refreshToken");
    if(!users){
        throw new ApiError(404, "Users not found");
    }
    res.status(200).json(new ApiResponse(200, "Users fetched successfully", users));
});
//=====================GET USER=====================
const getUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        throw new ApiError(400, "User ID is required.");
    }

    const user = await User.findById(userId).select("-password -refreshToken");

    if (!user) {
        throw new ApiError(404, "User not found.");
    }

    res.status(200).json(new ApiResponse(200, "User fetched successfully", user));
});
//=====================FOLLOW OR UNFOLLOW USER=====================
const followOrUnfollowUser = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const followerId = req.user._id;

    // Input validation
    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    if (userId === followerId.toString()) {
        throw new ApiError(400, "You can't follow or unfollow yourself");
    }

    // Check if target user exists
    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
        throw new ApiError(404, "User to follow/unfollow not found");
    }

    // Get follower user
    const followerUser = await User.findById(followerId);
    if (!followerUser) {
        throw new ApiError(404, "Follower user not found");
    }

    // Check if already following
    const isFollowing = userToFollow.followers.includes(followerId);

    try {
        if (isFollowing) {
            // Unfollow operation
            await User.findByIdAndUpdate(
                userId,
                { $pull: { followers: followerId } },
                { new: true, runValidators: true }
            );

            await User.findByIdAndUpdate(
                followerId,
                { $pull: { following: userId } },
                { new: true, runValidators: true }
            );

            return res.status(200).json(
                new ApiResponse(
                    200,
                    {},
                    `Successfully unfollowed ${userToFollow.username}`
                )
            );
        } else {
            // Follow operation
            await User.findByIdAndUpdate(
                userId,
                { $addToSet: { followers: followerId } },
                { new: true, runValidators: true }
            );

            await User.findByIdAndUpdate(
                followerId,
                { $addToSet: { following: userId } },
                { new: true, runValidators: true }
            );

            return res.status(200).json(
                new ApiResponse(
                    200,
                    {},
                    `Successfully followed ${userToFollow.username}`
                )
            );
        }
    } catch (error) {
        throw new ApiError(
            500,
            "Error while processing follow/unfollow operation"
        );
    }
});


export {
    registerUser,
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
    updateUserProfile,
};