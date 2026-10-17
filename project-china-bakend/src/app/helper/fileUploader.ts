import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import config from "../../config";
import path from "path";
import fs from "fs";
import os from "os";

// Cloudinary config
cloudinary.config({
    cloud_name: config.cloudinary.cloud_name,
    api_key: config.cloudinary.api_key,
    api_secret: config.cloudinary.api_secret,
});

// Multer storage for local uploads
let uploadsDir = path.join(process.cwd(), "uploads");

try {
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }
} catch (error) {
    // If it fails (e.g., read-only filesystem on Vercel), fallback to /tmp
    uploadsDir = path.join(os.tmpdir(), "uploads");
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

const isDummyCloudinary = (val?: string) => {
    if (!val) return true;
    const lower = val.toLowerCase();
    return (
        lower.includes("your_cloud_name") ||
        lower.includes("your_api_key") ||
        lower.includes("your_api_secret") ||
        lower.includes("placeholder")
    );
};

const hasCloudinaryConfig = Boolean(
    config.cloudinary.cloud_name &&
    config.cloudinary.api_key &&
    config.cloudinary.api_secret &&
    !isDummyCloudinary(config.cloudinary.cloud_name) &&
    !isDummyCloudinary(config.cloudinary.api_key) &&
    !isDummyCloudinary(config.cloudinary.api_secret),
);

const getLocalUploadUrl = (filePath: string) => `/uploads/${path.basename(filePath)}`;

// Upload to Cloudinary. In local/dev without Cloudinary env, keep the file in /uploads.
const uploadToCloudinary = async (filePath: string, folder: string = "china-project") => {
    if (!hasCloudinaryConfig) {
        return {
            url: getLocalUploadUrl(filePath),
            publicId: `local/${path.basename(filePath)}`,
        };
    }

    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder,
            resource_type: "auto",
        });

        // Remove local file after successful cloud upload
        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        } catch (unlinkErr) {
            console.warn("Could not delete local temp upload:", unlinkErr);
        }

        return {
            url: result.secure_url,
            publicId: result.public_id,
        };
    } catch (error) {
        console.warn("Cloudinary upload failed, safely falling back to local file storage:", error);
        return {
            url: getLocalUploadUrl(filePath),
            publicId: `local/${path.basename(filePath)}`,
        };
    }
};

// Delete from Cloudinary
const deleteFromCloudinary = async (publicId: string) => {
    if (!publicId) return;

    if (publicId.startsWith("local/")) {
        const localPath = path.join(uploadsDir, path.basename(publicId));
        if (fs.existsSync(localPath)) {
            try {
                fs.unlinkSync(localPath);
            } catch (err) {
                console.warn("Could not delete local file:", err);
            }
        }
        return;
    }

    if (hasCloudinaryConfig) {
        try {
            await cloudinary.uploader.destroy(publicId);
        } catch (error) {
            console.warn("Cloudinary destroy failed:", error);
        }
    }
};

export const fileUploader = {
    upload,
    uploadToCloudinary,
    deleteFromCloudinary,
};