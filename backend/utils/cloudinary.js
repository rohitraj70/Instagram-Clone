import cloudinaryPackage from 'cloudinary';
import dotenv from "dotenv";
dotenv.config({});

const { v2: cloudinary } = cloudinaryPackage;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

export default cloudinary;