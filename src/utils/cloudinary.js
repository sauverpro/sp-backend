import { v2 as cloudinary } from "cloudinary";
require("dotenv").config();
const { CLOUD_NAME, API_KEY, API_SECRETE } = process.env;
 cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRETE,
});

export const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
          if (error) {
              reject(error);
          } else {
              resolve(result.secure_url);
          }
      }).end(fileBuffer);
  });
};

 