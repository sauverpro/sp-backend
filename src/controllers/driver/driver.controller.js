import { customerOrderModel } from "../../models/customer.order.model";

import { v2 as cloudinary } from "cloudinary";
const { CLOUD_NAME, API_KEY, API_SECRETE } = process.env;
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRETE,
});
export const saveImage = async (req, res) => {
    try {
      const updateId = req.body.orderId;
      const image = req.file;
      let profile = await cloudinary.uploader.upload(image.path);
      console.log("image", profile.secure_url);
      const updateImages = await customerOrderModel.findByIdAndUpdate(updateId, {
        Evidence: profile.secure_url,
        Status: "Completed"
      });
      if (!updateImages) {
        return res.status(404).json({
          status: 404,
          message: "Failed to save Image",
        });
      }
      return res.status(200).json({
        status: 200,
        message: "Order Completed Successfully ",
        data: updateImages,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: 500,
        message: error.message,
      });
    }
  };
  