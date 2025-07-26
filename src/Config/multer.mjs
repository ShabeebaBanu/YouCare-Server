import multer from "multer";

//Image Array limit
export const MAX_IMAGE_LIMIT = 2;

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 2 * 1024 * 1024,
        files: MAX_IMAGE_LIMIT
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error( 'Only image files are allowed!' ), false);
        }
    }
});

export default upload;