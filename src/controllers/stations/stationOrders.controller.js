import { adminStockModel, stockModel } from "../../models";
import { stationOrderModel } from "../../models/station.orders.model";

//create external order

export const newStOrder = async (req, res) => {
  try {
    const newstationOrder = new stationOrderModel({
      StationId: req.body.StationId,
      ProductId: req.body.ProductId,
      Quantity: req.body.Quantity,
    });
    console.log(newstationOrder);

    const e1 = await newstationOrder.save();
    return res
      .status(201)
      .json({ message: "Order Sent successfully", data: e1 });
  } catch (err) {
    res
      .status(500)
      .json({ message: "internal server error", error: err.message });
  }
};

//Get External Order

export const getstOrders = async (req, res) => {
  try {
    const readStOrders = await stationOrderModel
      .find()
      .populate("ProductId StationId")
      .populate({
        path: "StationId",
        populate: {
          path: "managerId",
          model: "users", // Replace 'Manager' with the actual model name for managers
        },
      });
    if (!readStOrders) {
      return res.json({ message: "station orders not found" });
    }
    return res.status(200).json({ readStOrders });
  } catch (err) {
    console.log("error: ", err);
    return res.status(500).json({ message: err.message });
  }
};

//get one external order

export const getOneStOrder = async (req, res) => {
  try {
    const readOneStOrder = await stationOrderModel
      .findById(req.params.id)
      .populate("ProductId StationId")
      .populate({
        path: "StationId",
        populate: {
          path: "managerId",
          model: "users", // Replace 'Manager' with the actual model name for managers
        },
      });
    if (!readOneStOrder) {
      return res.status(404).json({ message: "Orders not found" });
    }

    res.json(readOneStOrder);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "internal server error", error: err.message });
  }
};

//update external order

export const updateStOrder = async (req, res) => {
  try {
    const updateStationQt = await stationOrderModel.findById(req.params.id);
    if (!updateStationQt) {
      return res.status(404).json({ message: "orders not found" });
    }

    updateStationQt.Quantity = req.body.Quantity;

    const updateStQt = await updateStationQt.save();
    return res.json({
      message: "Quantity Updated successfully",
      data: updateStQt,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "internal server error", error: err.message });
  }
};

//update completed status order

export const updateStComplet = async (req, res) => {
  try {
    const { stationId, productId } = req.body;
    const existingStock = await stockModel.findOne({ stationId, productId });

    const adminStock = await adminStockModel.findOne({ productId });

    adminStock.Full -= req.body.quantity;
    adminStock.Empty += req.body.quantity;
    const updatedAdminStock = await adminStock.save();
    if (!updatedAdminStock) {
      return res.status(401).json({
        message: "Failed transfer stock",
      });
    }

    existingStock.Full += req.body.quantity;
    existingStock.Empty -= req.body.quantity;
    // existingStock.purchasePrice = req.body.purchasePrice;
    const checkKilograms = await existingStock.save();
    if (!checkKilograms) {
      return res.status(401).json({
        message: "Failed to update station stock ",
      });
    }
    const updateStCp = await stationOrderModel.findById(req.params.id);

    if (!updateStCp) {
      return res.status(404).json({ message: "orders not found" });
    }
    updateStCp.Status = "Approved";
    const stcomplete1 = await updateStCp.save();
    return res.json({
      message: "Order approved Successfully",
      data: stcomplete1,
    });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

//update cancelled status order

export const updateStCt = async (req, res) => {
  try {
    const updateStCancel = await stationOrderModel.findById(req.params.id);
    if (!updateStCancel) {
      return res.status(404).json({ message: "orders not found" });
    }

    updateStCancel.Status = "Cancelled";

    const updateStatuco = await updateStCancel.save();
    return res.json({ message: "Order Cancelled", data: updateStatuco });
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .json({ message: "internal server error", error: err.message });
  }
};

//Delete External Order

export const deleteStOrder = async (req, res) => {
  try {
    const deleteStOrder = await stationOrderModel.findByIdAndDelete(
      req.params.id
    );
    return res.json(deleteStOrder);
  } catch (err) {
    res.status(500).json({ message: "internal server error" });
  }
};
