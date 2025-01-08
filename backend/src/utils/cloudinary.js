import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { promisify } from 'util';
import logger from '../logger.js';
import dotenv from 'dotenv';

// Initialize environment variables
dotenv.config();

const deleteFile = promisify(fs.unlink);

// Configure Cloudinary with environment check
const configureCloudinary = () => {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
        logger.error('Missing Cloudinary credentials');
        throw new Error(
            'Missing Cloudinary credentials. Please ensure CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are set in your environment'
        );
    }

    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret
    });

    // Test configuration
    try {
        cloudinary.config().cloud_name;
        logger.info('Cloudinary configured successfully');
    } catch (error) {
        logger.error('Failed to configure Cloudinary:', error);
        throw new Error('Cloudinary configuration failed');
    }
};

// Initialize Cloudinary configuration
configureCloudinary();

const uploadOnCloudinary = async (localFilePath) => {
    try {
        // Validate input
        if (!localFilePath) {
            logger.error('No file path provided');
            throw new Error("Local file path is required");
        }

        // Validate file existence
        if (!fs.existsSync(localFilePath)) {
            logger.error(`File not found: ${localFilePath}`);
            throw new Error("File not found at the specified path");
        }

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const uploadOptions = {
                resource_type: "auto",
                timeout: 60000,
                quality: "auto:best",
                fetch_format: "auto",
                folder: process.env.CLOUDINARY_FOLDER || 'uploads' // Optional folder setting
            };

            const uploadStream = cloudinary.uploader.upload_stream(
                uploadOptions,
                (error, result) => {
                    if (error) {
                        logger.error('Upload failed:', error);
                        reject(new Error(`Cloudinary upload failed: ${error.message}`));
                        return;
                    }
                    resolve(result);
                }
            );

            // Handle file streaming
            const readStream = fs.createReadStream(localFilePath);
            
            readStream.on('error', (error) => {
                logger.error('File read error:', error);
                reject(new Error(`Error reading file: ${error.message}`));
            });

            readStream
                .pipe(uploadStream)
                .on('error', (error) => {
                    logger.error('Stream error:', error);
                    reject(new Error(`Error during upload: ${error.message}`));
                });
        });

        // Log success and clean up
        logger.info(`File uploaded successfully: ${result.secure_url}`);

        // Clean up local file
        await deleteFile(localFilePath)
            .then(() => logger.info(`Local file deleted: ${localFilePath}`))
            .catch(error => logger.warn(`Failed to delete local file: ${localFilePath}`, error));

        return result;

    } catch (error) {
        // Clean up on error
        if (localFilePath && fs.existsSync(localFilePath)) {
            await deleteFile(localFilePath)
                .then(() => logger.info(`Local file deleted after failed upload: ${localFilePath}`))
                .catch(error => logger.error('Cleanup error:', error));
        }

        logger.error('Upload to Cloudinary failed:', error);
        throw error; // Preserve original error
    }
};

const deleteCloudinaryImage = async (publicId) => {
    if (!publicId) {
        logger.warn('No public ID provided for deletion');
        return null;
    }

    try {
        const result = await cloudinary.uploader.destroy(publicId, {
            invalidate: true // Invalidate CDN cache
        });
        
        if (result.result === 'ok') {
            logger.info(`Image deleted from Cloudinary: ${publicId}`);
            return true;
        } else {
            logger.warn(`Unexpected response from Cloudinary: ${result.result}`);
            return false;
        }
    } catch (error) {
        logger.error(`Deletion failed for ${publicId}:`, error);
        throw error; // Preserve original error
    }
};

export { uploadOnCloudinary, deleteCloudinaryImage };