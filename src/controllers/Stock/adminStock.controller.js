import { adminStockModel } from "../../models";

export const addAdminStock = async (req, res) => {
  try {
    const { productId } = req.body;
    console.log("ids", productId);
    const product = await adminStockModel.findOne({ productId: productId });
    if (!product) {
      return res.status(400).json({
        message: "Stock not found, Please add empty bottles and try again",
      });
    }
    product.Full += req.body.quantity;
    product.Empty -= req.body.quantity;
    product.purchasePrice = req.body.purchasePrice;
    const checkKilograms = await product.save();

    return res.status(201).json({
      status: true,
      message: "Stock added successfully",
      data: checkKilograms,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const addEmpty = async (req, res) => {
  try {
    const { productId, emptyValue } = req.body;

    // Check if the product exists in the stock
    const existingStock = await adminStockModel.findOne({ productId });

    if (existingStock) {
      // If the product exists, update the empty value
      existingStock.Empty += emptyValue;
      const updatedStock = await existingStock.save();
      res.status(200).json(updatedStock);
    } else {
      // If the product doesn't exist, create a new stock entry
      const newStockEntry = await adminStockModel.create({
        productId,
        Empty: emptyValue,
      });
      res.status(200).json({
        message: "Empty bottles added successfully",
        data: newStockEntry,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const AllAdminStock = async (req, res) => {
  try {
    const allStockEntries = await adminStockModel.find().populate("productId");
    res.status(200).json(allStockEntries);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getAdminStock = async (req, res) => {
  try {
    const foundStockEntry = await adminStockModel
      .findById(req.params.id)
      .populate("productId");
    if (!foundStockEntry) {
      return res.status(404).json({ message: "Stock entry not found" });
    }
    res.status(200).json(foundStockEntry);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
//
// Delete Stock

export const deleteAdminStock = async (req, res) => {
  try {
    const id = req.params.stockId;
    console.log(id);
    let data = await adminStockModel.findByIdAndDelete({ _id: id });
    if (!data) {
      return res.status(404).json({ message: "Stock not found" });
    }
    res
      .status(200)
      .json({ message: "Stock deleted successfully:", data: data });
    console.log("Stock deleted successfully:", data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
