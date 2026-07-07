import { adminStockModel, stockModel } from "../../models";

export const addStationStock = async (req, res) => {
  try {
    const { stationId, productId } = req.body;
    const existingStock = await stockModel.findOne({ stationId, productId });

    const adminStock = await adminStockModel.findOne({ productId });
    console.log("admin:",adminStock);
    if (!existingStock) {
      adminStock.Full -= req.body.quantity;
      const updatedStock = await adminStock.save();
      if (!updatedStock) {
        return res.status(401).json({
          message: "Failed transfer stock",
        });
      }
      const newStockEntry = await stockModel.create({
        stationId,
        productId,
        Full: req.body.quantity,
      });
      if (!newStockEntry) {
        return res.status(201).json({
          status: false,
          message: "Failed to record stock",
        });
      }
      return res.status(200).json({
        message: "Stock Recorded Successfully",
        data: newStockEntry,
      });
    }

    adminStock.Full -= req.body.quantity;
    adminStock.Empty += req.body.quantity;
    existingStock.Full += req.body.quantity;
    existingStock.Empty += req.body.quantity;
    // existingStock.purchasePrice = req.body.purchasePrice;
    const updatedStock = await adminStock.save();
    const checkKilograms = await existingStock.save();
    if (!updatedStock || !checkKilograms) {
      return res.status(200).json({
        message: "Stock Recorded Successfully",
        data: newStockEntry,
      });
    }
    return res.status(201).json({
      status: true,
      message: "Stock added successfully",
      stationStock: checkKilograms,
      adminStock: updatedStock,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const allStock = async (req, res) => {
  try {
    let data = await stockModel.find().populate("productId stationId");
    if (!data) {
      return res.status(200).json({ status: 200, data: data });
    }
    return res.status(200).json({ status: 200, data: data });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "internal server error",
    });
  }
};

// Getting Single customer Details

export const getStockById = async (req, res) => {
  try {
    const id = req.params.stockId;
    let Stock = await stockModel.findById(id).populate("stationId productId");
    if (!Stock) {
      return res.status(404).json({
        message: "Stock doesn't found",
      });
    }
    res.status(200).json({
      message: "Stock founded",
      data: Stock,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: "internal server error",
    });
  }
};

// End of Getting Single Stock Details

// Function to get all stock entries by stationId
export const getAllStockEntriesByStationId = async (req, res) => {
  try {
    const stationId = req.params.stationId;
    const stockEntries = await stockModel
      .find({ stationId: stationId })
      .populate("stationId")
      .populate("productId");
    return res.status(200).json(stockEntries);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

//   ........................................................................

// Delete Stock

export const deleteStock = async (req, res) => {
  try {
    const id = req.params.stockId;
    console.log(id);
    let data = await stockModel.findByIdAndDelete({ _id: id });
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

// End
