import { addOnsModel } from "../../models";
import { v2 as cloudinary } from "cloudinary";
const { CLOUD_NAME, API_KEY, API_SECRETE } = process.env;
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRETE
});
// register Product
export const addItem = async (req, res) => {
  try {
    // Check if the item already exists
    const checkAddOn = await addOnsModel.findOne({
      Name: req.body.Name
    });

    if (checkAddOn) {
      return res.status(409).json({
        status: false,
        message: "Item already exists"
      });
    }

    // Validate and handle file upload
    if (req.file) {
      const image = req.file;
      console.log("image", image);

      try {
        // Upload image to Cloudinary
        let profile = await cloudinary.uploader.upload(image.path);
        console.log("image", profile.secure_url);

        // Convert space-separated product IDs to an array of ObjectIds
        const products = req.body.productId.split(",");
        console.log("PRODUCT", products);

        const newAddOn = new addOnsModel({
          Name: req.body.Name,
          Image: profile.secure_url,
          Price: req.body.Price,
          productId: products
        });

        // Save the new add-on
        const savedAddOn = await newAddOn.save();

        if (!savedAddOn) {
          return res.status(500).json({
            message: "Failed to add new Item!! Try again later"
          });
        }

        return res.status(201).json({
          message: "Item added successfully",
          success: true,
          data: newAddOn
        });
      } catch (uploadError) {
        console.error("Image upload failed:", uploadError);
        return res.status(500).json({
          message: "Failed to upload image to Cloudinary",
          error: uploadError.message
        });
      }
    }

    // No file provided
    return res
      .status(400)
      .json({ message: "Please provide an image for " + req.body.Name });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};

// end of Product registration

//   ........................................................................

// Getting Single customer Details

export const getAddOnById = async (req, res) => {
  try {
    const id = req.params.id;
    let foundAddOn = await addOnsModel.findById(id).populate("productId");

    if (!foundAddOn) {
      return res.status(404).json({
        message: "Add-on not found"
      });
    }
    res.status(200).json({
      message: "Add-On founded",
      data: foundAddOn
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: "internal server error",
      error: error.message
    });
  }
};

// End of Getting Single Product Details
//   ........................................................................
// Getting all Products

export const getAllAddOns = async (req, res) => {
  try {
    let data = await addOnsModel.find().populate("productId");
    return res.status(200).json({ status: 200, data: data });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "internal server error",
      error: error.message
    });
  }
};

// End of Getting all customers Details

// // ..........................................................................
// export const updatedAddOn = async (req, res) => {
//   try {
//     const updatedAddOn = await addOnsModel.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       { new: true } // Return the modified document
//     );
//     if (!updatedAddOn) {
//       return res.status(404).json({ message: "Add-on not found" });
//     }
//     res.status(200).json(updatedAddOn);
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Error updating add-on", error: error.message });
//   }
// };
// Call the function to update TotalPrice

// .......Product............................................................

// Delete Product

export const deletedAddOn = async (req, res) => {
  try {
    const deletedAddOn = await addOnsModel.findByIdAndDelete(req.params.id);
    if (!deletedAddOn) {
      return res.status(404).json({ message: "Add-on not found" });
    }
    res.status(200).json({ message: "Add-on deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting add-on", error: error.message });
  }
};

// End

//Update account

export const updateAddOn = async (req, res) => {
  try {
    const image = req.file;
    let profile = await cloudinary.uploader.upload(image.path);
    console.log("image", profile.secure_url);
    const updateAddOn = await addOnsModel.findById(req.params.id);
    if (!updateAddOn) {
      return res.status(404).json({ message: "addons not found" });
    }
    const products = req.body.productId.split(",");
    console.log("PRODUCT", products);
    updateAddOn.Image = profile.secure_url;
    updateAddOn.Name = req.body.Name;
    updateAddOn.Price = req.body.Price;
    updateAddOn.productId = products;
    const updatedAddons = await updateAddOn.save();
    res.json(updatedAddons);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "internal servor error", error: err.message });
  }
};
