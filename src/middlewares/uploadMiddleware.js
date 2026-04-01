import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg"
    ) {
      cb(null, true);
    } else {
      cb(new Error("hanya boleh format file jpeg atau png"), false);
    }
};

export const uploadVenueImage = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 4 * 1024 * 1024 }, // ukuran file maksimal 4mb
});