import path from "path";
import multer from "multer";
import crypto from "crypto";

const UPLOADS_FOLDER = path.resolve(__dirname, "..", "..", "tmp", "uploads");

export const UPLOAD_CONFIG = {
    directory: UPLOADS_FOLDER,
    storage: multer.diskStorage({
        destination: UPLOADS_FOLDER,
        filename(request, file, callback) {
            const fileHash = crypto.randomBytes(10).toString("hex");
            const fileName = `${fileHash}-${file.originalname}`;

            return callback(null, fileName);
        },
    }),
};