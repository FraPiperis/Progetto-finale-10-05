const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

// Configurazione di Cloudinary
cloudinary.config({
  cloud_name: process.env.dzqwacsjg,
  api_key: process.env.618189748969395,
  api_secret: process.env.kq4JluRQtWW0OFV4n1Y4TJFXl_Y,
});

// Storage per multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "striveBlog", // Nome della cartella su Cloudinary
    format: async (req, file) => "jpg", // Forza JPG, puoi personalizzare
    public_id: (req, file) => file.originalname.split(".")[0], // Nome del file
  },
});

// Middleware di upload con multer
const upload = multer({ storage });

module.exports = { cloudinary, upload };
