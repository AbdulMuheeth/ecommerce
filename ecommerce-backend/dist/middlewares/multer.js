import multer from "multer";
import { v4 as uuid } from "uuid";
const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, "uploads"); // file location
    },
    filename(req, file, callback) {
        let extension = file.originalname.split(".").pop();
        let fileName = uuid();
        callback(null, `${fileName}.${extension}`); // file name
    },
});
export const singleUpload = multer({ storage }).single("photo");
