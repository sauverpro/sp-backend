import { cartModel } from "../../models/cartItems.model.js";
import { customerOrderModel } from "../../models/customer.order.model.js";
import mongoose from "mongoose";
// new orders

export const orders = async (req, res) => {
  try {
    const newOrder = new customerOrderModel({
      CartId: req.body.CartId,
      TotalOrder: req.body.TotalOrder,
      address: req.body.address,
      phoneNumber: req.body.phoneNumber
    });
    console.log({
      CartId: req.body.CartId,
      address: req.body.address,
      phoneNumber: req.body.phoneNumber,
      TotalOrder: req.body.totalOrder
    });
    const a1 = await newOrder.save();
    return res.json({ message: "Order created successfully", data: a1 });
  } catch (err) {
    res.status(401).send("err", err.message);
  }
};

//read orders

export const readOrder = async (req, res) => {
  try {
    const readAll = await customerOrderModel
      .find()
      .sort({ createdAt: -1 })
      .populate({
        path: "CartId",
        populate: {
          path: "UserId",
          model: "users"
        }
      })
      .populate({
        path: "CartId",
        populate: {
          path: "products.productId",
          model: "products"
        }
      })
      .populate({
        path: "CartId",
        populate: {
          path: "addOns.addonId",
          model: "addOns"
        }
      })
      .populate("StationId DriverId");
    if (!readAll) {
      return res.status(404).json({
        message: []
      });
    }

    res.json(readAll);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Internal server error",
      err: err.message
    });
  }
};
export const userOder = async (req, res) => {
  try {
    const userIdToSearch = req.params.userId;

    const order = await customerOrderModel.find({CartId: userIdToSearch}).populate({
      path: "CartId",
      populate: {
        path: "UserId",
        model: "users",
      },
    });
    return res.status(200).json(order);
  } catch (error) {
    console.log("error", error);
    return res.status(500).json({
      error: error.message,
    });
  }

  // .exec((err, orders) => {
  //   if (err) {
  //     console.error(err);
  //     return res.status(500).json({ error: "Internal Server Error" });
  //   }

  //   const filteredOrders = orders.filter(
  //     (order) => order.CartId && order.CartId.UserId
  //   );

  // });
};

//read one order

export const readOneOrder = async (req, res) => {
  try {
    const oneOrder = await customerOrderModel
      .findById(req.params.id)
      .sort({ createdAt: -1 })
      .populate({
        path: "CartId",
        populate: {
          path: "UserId",
          model: "users"
        }
      })
      .populate({
        path: "CartId",
        populate: {
          path: "products.productId",
          model: "products"
        }
      })
      .populate({
        path: "CartId",
        populate: {
          path: "addOns.addonId",
          model: "addOns"
        }
      })
      .populate("StationId DriverId");
    if (!oneOrder) {
      return res.status(404).json({ message: "Orders not found" });
    }

    res.json(oneOrder);
    console.log(oneOrder);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateStationId = async (req, res) => {
  try {
    // Find the document in the database by ID
    const updateAstation = await customerOrderModel.findById(
      req.params.orderId
    );
    if (!updateAstation) {
      return res.status(404).json({
        messasge: "Order does not found"
      });
    }
    // Update the StationId with the value from the request body
    updateAstation.StationId = req.body.StationId;
    updateAstation.Status = "Processing";

    // Save the updated document back to the database
    const stationUpdated = await updateAstation.save();

    // Send the updated document as JSON in the response
    res.json(stationUpdated);
  } catch (error) {
    // Handle errors (e.g., document not found, validation error, etc.)
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateDriverId = async (req, res) => {
  try {
    // Attempt to find the customer order by ID
    const updateAdriver = await customerOrderModel.findById(req.params.orderId);

    // If the customer order is not found, handle the error
    if (!updateAdriver) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Update the DriverId with the value from the request body
    updateAdriver.DriverId = req.body.DriverId;
    updateAdriver.Status = "Delivering";

    // Save the updated customer order
    const driverUpdated = await updateAdriver.save();

    // Respond with the updated customer order
    res.json(driverUpdated);
  } catch (error) {
    // Handle any errors that occurred during the try block
    console.error("Error updating driver ID:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const stationOrders = async (req, res) => {
  try {
    const StationId = req.params.StationId;
    const ordersByDriver = await customerOrderModel
      .find({ StationId: StationId })
      .sort({ createdAt: -1 })
      .populate({
        path: "CartId",
        populate: {
          path: "UserId",
          model: "users"
        }
      })
      .populate({
        path: "CartId",
        populate: {
          path: "products.productId",
          model: "products"
        }
      })
      .populate({
        path: "CartId",
        populate: {
          path: "addOns.addonId",
          model: "addOns"
        }
      })
      .populate("StationId")
      .populate("DriverId");

    res.status(200).json(ordersByDriver);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};
export const driverOrders = async (req, res) => {
  try {
    const driverId = req.userId;
    const ordersByDriver = await customerOrderModel
      .find({ DriverId: driverId })
      .sort({ createdAt: -1 })
      .populate({
        path: "CartId",
        populate: {
          path: "UserId",
          model: "users"
        }
      })
      .populate({
        path: "CartId",
        populate: {
          path: "products.productId",
          model: "products"
        }
      })
      .populate({
        path: "CartId",
        populate: {
          path: "addOns.addonId",
          model: "addOns"
        }
      })
      .populate("StationId")
      .populate("DriverId");

    res.status(200).json(ordersByDriver);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};
//DeleteOrder

export const orderDelete = async (req, res) => {
  try {
    const deleteOrder = await customerOrderModel.findByIdAndDelete(
      req.params.id
    );
    return res.json(deleteOrder);
  } catch (error) {
    res.status(500).json({ message: "internal servor error" });
  }
};

export const cancelOrders = async (req, res) => {
  try {
    const orderCancel = await customerOrderModel.findById(req.params.id);
    if (!orderCancel) {
      res.status(404).json({ message: `can't find the order` });
    }
    orderCancel.Status = "Cancelled";
    const beingCanc = await orderCancel.save();
    return res.json({ message: "order cancelled", data: beingCanc });
  } catch (err) {
    console.log(err);
    res.json({ message: "internal server error", error: err.message });
  }
};

export const isCompOrders = async (req, res) => {
  try {
    const orderComplete= await customerOrderModel.findById(req.params.id);
    if (!orderComplete) {
      res.status(404).json({ message: `can't find the order` });
    }
    orderComplete.Status = "Completed";
    const beingComp = await orderComplete.save();
    return res.json({ message: "order completed", data: beingComp });
  } catch (err) {
    console.log(err);
    res.json({ message: "internal server error", error: err.message });
  }
};

// //update cancelled status order

// export const updateStCt = async (req, res) => {
//   try {
//     const updateStCancel = await stationOrderModel.findById(req.params.id);
//     if (!updateStCancel) {
//       return res.status(404).json({ message: "orders not found" });
//     }

//     updateStCancel.Status = "Cancelled";

//     const updateStatuco = await updateStCancel.save();
//     return res.json({ message: "Order Cancelled", data: updateStatuco });
//   } catch (err) {
//     console.log(err);
//     res
//       .status(500)
//       .json({ message: "internal server error", error: err.message });
//   }
// };
