import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import logger from "../logger.js";

const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // Get token from multiple sources with proper cleanup
        const token = extractToken(req);
        
        if (!token) {
            logger.warn("JWT Verification Failed: No token provided");
            throw new ApiError(401, "Authentication required");
        }

        try {
            const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {
                algorithms: ["HS256"], 
                maxAge: process.env.ACCESS_TOKEN_EXPIRY || "1d" 
            });

            if (!decodedToken?._id) {
                logger.error("JWT Verification Failed: Invalid token payload");
                throw new ApiError(401, "Invalid authentication token");
            }

            // Check if user exists and is not blocked/deleted
            const user = await User.findOne({ 
                _id: decodedToken._id,
                isActive: true 
            }).select("-password -refreshToken");

            if (!user) {
                logger.warn(`JWT Verification Failed: User not found or inactive - ID: ${decodedToken._id}`);
                throw new ApiError(401, "User no longer has access");
            }

            // Add user to request object
            req.user = user;
            
            // Security: Clear sensitive data
            delete req.body?.password;
            delete req.body?.refreshToken;
            
            // Add request tracking for security monitoring
            logger.info(`Authenticated request from user: ${user._id} - ${req.method} ${req.originalUrl}`);
            
            next();
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                logger.warn("JWT Verification Failed: Token expired");
                throw new ApiError(401, "Authentication token has expired");
            } else if (error instanceof jwt.JsonWebTokenError) {
                logger.warn(`JWT Verification Failed: ${error.message}`);
                throw new ApiError(401, "Invalid authentication token");
            }
            throw error;
        }
    } catch (error) {
        // Log the full error for debugging but send limited info to client
        logger.error("JWT Verification Error:", {
            error: error.message,
            stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
            path: req.path,
            method: req.method
        });

        next(error);
    }
});

// Helper function to extract token from different sources
const extractToken = (req) => {
    // Check authorization header first
    const authHeader = req.header("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
        return authHeader.replace("Bearer ", "").trim();
    }

    // Check cookies next
    if (req.cookies?.accessToken) {
        return req.cookies.accessToken.trim();
    }

    return null;
};

export { verifyJWT };