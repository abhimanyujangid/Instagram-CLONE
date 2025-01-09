import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import logger from "../logger.js";
import { uploadOnCloudinary, deleteCloudinaryImage } from "../utils/cloudinary.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

//=====================SEND MESSAGE=====================
const sendMessage = asyncHandler(async (req, res) => {
    const { text } = req.body;
    const { _id: senderId } = req.user;
    const { receiverId } = req.params;
    let image;
    const imageLocalPath = req.files?.image?.[0]?.path;
    const [receiver, sender] = await Promise.all([
        User.findById(receiverId),
        User.findById(senderId),
    ]);

    // Check if the image is present in the request
    if (imageLocalPath) {
        try {
            // Upload the image to Cloudinary
            image = await uploadOnCloudinary(imageLocalPath);
            if (!image?.secure_url) {
                throw new ApiError(500, "Failed to upload image to Cloudinary.");
            }
        } catch (error) {
            // Cleanup Cloudinary image if upload fails
            if (image?.public_id) {
                await deleteCloudinaryImage(image.public_id);
            }
            throw new ApiError(500, "Error uploading image to Cloudinary.");
        }
    }
    if (!receiver || !sender) {
        throw new ApiError(404, "Receiver or sender not found.");
    }

    let conversation = await Conversation.findOne({
        participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
        conversation = await Conversation.create({
            participants: [senderId, receiverId],
            messages: [],
        });
    }
    console.log(image);
    if (!text && !image) {
        throw new ApiError(400, "At least one of message text or image is required.");
    }

    const newMessage = await Message.create({
        sender: senderId,
        receiver: receiverId,
        text: text ,
        image: image?.secure_url || "",
    })

    if(!newMessage){
        throw new ApiError(500, "Error while sending message.");
    }

    await conversation.messages.push(newMessage._id);


    await Promise.all([
        conversation.save(),
        newMessage.save(),
    ]);

    //Implement socket.io to notify the receiver of the new message

    return res.status(201).json(new ApiResponse(201, "Message sent successfully", newMessage));
});

//=====================GET MESSAGES=====================
const getMessages = asyncHandler(async (req, res) => {
    try {
        const { receiverId } = req.params;
        const { _id: senderId } = req.user;
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        })
        .populate({
            path: "messages",
            select: "text image sender receiver createdAt",
        });
        if (!conversation) {
            throw new ApiError(404, "Conversation not found.");
        }
        res.status(200).json(new ApiResponse(200, "Messages", conversation.messages));
    } catch (error) {
        throw new ApiError(500, "Error while fetching messages.");
    }
});

export { sendMessage, getMessages };