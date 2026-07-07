import { productModel } from "../../models";
import { v2 as cloudinary } from "cloudinary";
const { CLOUD_NAME, API_KEY, API_SECRETE } = process.env;
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRETE,
});
// register Product
export const RegisterProduct = async (req, res) => {
  try {
    const existingKilos = await productModel.findOne({
      Kilograms: req.body.Kilograms,
    });
    if (existingKilos) {
      return res.status(201).json({
        status: true,
        message: "Product already exists",
      });
    }

    if (req.file) {
      const image = req.file;
      console.log("image", image);
      let profile = await cloudinary.uploader.upload(image.path);
      console.log("image", profile.secure_url);

      let newProduct = await productModel.create({
        ...req.body,
        Image: profile.secure_url,
      });
      if (!newProduct) {
        return res.status(403).json({
          message: "Failed to add new Product!! Try again later",
        });
      }
      return res.status(201).json({
        message: "Product registered successfully",
        success: true,
        data: newProduct,
      });
    }
    return res.status(404).json({ message: "Please provide image for gas" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// end of Product registration

//   ........................................................................

// Getting Single customer Details

export const getProductById = async (req, res) => {
  try {
    const id = req.params.productId;
    let Product = await productModel.findById(id);
    if (!Product) {
      return res.status(404).json({
        message: "Product doesn't found",
      });
    }
    res.status(200).json({
      message: "Product founded",
      data: Product,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: "internal server error",
    });
  }
};

// End of Getting Single Product Details
//   ........................................................................
// Getting all Products

export const getAllProduct = async (req, res) => {
  try {
    let data = await productModel.find();
    if (!data) {
      return res.status(200).json({ status: 200, data: data });
    }
    res.status(200).json({ status: 200, data: data });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "internal server error",
    });
  }
};

// End of Getting all customers Details

// ..........................................................................
export const updateTotalPrice = async (req, res) => {
  try {
    // Fetch all documents in the 'Products' collection
    const UnitPrice = req.body.UnitPrice;
    console.log("updatedTotalPrice: ", UnitPrice);
    const Products = await productModel.find();
    // Update the TotalPrice field for each document
    const updatePromises = Products.map(async (Product) => {
      return UnitPrice * Product.Kilograms;

      // await productModel.findByIdAndUpdate(Product._id, {
      //   TotalPrice: updatedTotalPrice,
      // });
    });
    console.log("update", updatePromises);
    // Execute all update operations concurrently
    // await Promise.all(updatePromises);

    console.log("TotalPrice updated successfully for all documents.");
    return res.status(200).json({
      status: "SUCCESS",
      message: "TotalPrice updated successfully for all documents.",
    });
  } catch (error) {
    console.log("Error updating TotalPrice:", error);
    return res.status(500).json({
      message: "Error updating TotalPrice:",
      error: error.message,
    });
  }
};

// Call the function to update TotalPrice

// .......Product............................................................

// Delete Product

export const deleteProduct = async (req, res) => {
  try {
    const id = req.params.productId;
    console.log(id);
    let data = await productModel.findByIdAndDelete({ _id: id });
    if (!data) {
      return res.status(404).json({ message: "Product not found" });
    }
    res
      .status(200)
      .json({ message: "Product deleted successfully:", data: data });
    console.log("Product deleted successfully:", data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

//Update Product

export const updateProduct = async (req, res) => {
  try {
    const image = req.file;
    let profile = await cloudinary.uploader.upload(image.path);
    console.log("image", profile.secure_url);
    const updatePr = await productModel.findById(req.params.id);
    if (!updatePr) {
      return res.status(404).json({ message: "product not found" });
    }
    updatePr.Image = profile.secure_url;
    updatePr.Name = req.body.Kilograms;
    updatePr.Type = req.body.Type;
    const isProduct = await updatePr.save();
    res.json(isProduct);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "internal servor error", error: err.message });
  }
};







// End
