import { externalOrder } from "../../models/external.order.model";

//create external order

export const extOrder = async (req, res) => {
  try {
    const newExtOrder = new externalOrder({
      FullName: req.body.FullName,
      PhoneNumber: req.body.PhoneNumber,
      StationId: req.body.StationId,
      ProductId: req.body.ProductId,
      Quantity: req.body.Quantity,
      receiptNumber: req.body.receiptNumber,
      PaymentMethod: req.body.PaymentMethod,
      Amount: req.body.Amount,
    });
    console.log(newExtOrder);

    const e1 = await newExtOrder.save();
    res.json(e1);
  } catch (err) {
    res.status(500).json({ message: "internal server error" });
  }
};

//Get External Order

export const getOrders = async (req, res) => {
  try {
    const readOrders = await externalOrder
      .find()
      .populate("ProductId StationId");
    console.log("hello there");
    if (!readOrders) {
      return res.json({ message: "orders not found" });
    }
    return res.status(200).json({ Orders: readOrders });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "internal server error" });
  }
};
//
export const stationExternalOrders = async (req, res) => {
  try {
    const StationId = req.params.StationId;
    const ordersByDriver = await externalOrder
      .find({ StationId: StationId })
      .sort({ createdAt: -1 })
      .populate("ProductId StationId");
    res.status(200).json(ordersByDriver);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
//get one external order

export const getOneExtOrder = async (req, res) => {
  try {
    const readOneExtOrder = await externalOrder
      .findById(req.params.id)
      .populate("ProductId StationId");
    if (!readOneExtOrder) {
      return res.status(404).json({ message: "Orders not found" });
    }

    return res.json(readOneExtOrder);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "internal server error" });
  }
};

//update external order

export const updateExtOrder = async (req, res) => {
  try {
    const updateExt = externalOrder.findById(req.params.id);
    if (!updateExt) {
      return res.status(404).json({ message: "orders not found" });
    }
    updateExt.FullName = req.body.FullName;
    updateExt.PhoneNumber = req.body.PhoneNumber;
    updateExt.ProductId = req.body.ProductId;
    updateExt.StationId = req.body.StationId;
    updateExt.Quantity = req.body.Quantity;
    updateExt.receiptNumber = req.body.receiptNumber;
    updateExt.Amount = req.body.Amount;

    const updateExtOrder = await updateExt.save();
    res.json(updateExtOrder);
  } catch (err) {
    res.status(500).json({ message: "internal server error" });
  }
};

//Delete External Order

export const deleteExtOrder = async (req, res) => {
  try {
    const deleteExt = await externalOrder.findByIdAndDelete(req.params.id);
    return res.json(deleteExt);
  } catch (err) {
    res.status(500).json({ message: "internal server error" });
  }
};
