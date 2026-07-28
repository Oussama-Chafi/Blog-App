const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploader = multer({ storage: multer.memoryStorage() });

const uploadToCloudinary = async (file, folderName) => {
  return new Promise((resolve, reject) => {
    const steam = cloudinary.uploader.upload_stream(
      { folder: folderName },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      },
    );
    streamifier.createReadStream(file.buffer).pipe(steam);
  });
};

const removeFromCloudinary = async (publicId) => {
  const result = await cloudinary.uploader.destroy(publicId);
  return result;
};

module.exports = { uploader, uploadToCloudinary, removeFromCloudinary };
