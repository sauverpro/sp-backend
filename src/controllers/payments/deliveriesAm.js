import { deliveryAm } from "../../models/deliveryfee.model";

//create deliveryfee

export const createDel = async (req, res) => {
  try {
    const newDel = new deliveryAm({
      Amount: req.body.Amount,

    });
    console.log(req.body.Amount);

    const delivery1 = await newDel.save();
    res.json(delivery1);
  } catch (err) {
    res.status(500).json({ message: "internal server error" });
  }
};

//Get All Deliveries

export const getDeliveries = async (req, res) => {
  try {
    const readAllDel = await deliveryAm.find()
    if (!readAllDel) {
      return res.json({ message: "delivery fee not found" });
    }
    return res.status(200).json({ Amount: readAllDel });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "internal server error" });
  }
};

//get one Deliverie

export const getOneDelivery = async (req, res) => {
  try {
    const readOneDel = await deliveryAm
      .findById(req.params.id)
    if (!readOneDel) {
      return res.status(404).json({ message: "Orders not found" });
    }

    return res.json(readOneDel);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "internal server error" });
  }
};

//update a delivery

export const updateDelivery = async (req, res) => {
  try {
    const updateDelFee = await deliveryAm.findById(req.params.id);
    if (!updateDelFee) {
      return res.status(404).json({ message: "delivery fee not found" });
    }
    updateDelFee.Amount = req.body.Amount;


    const updateDeliveries = await updateDelFee.save();
    res.json(updateDeliveries);
  } catch (err) {
    res.status(500).json({ message: "internal server error" });
  }
};

//Delete External Order

export const deleteDeliveryFee = async (req, res) => {
  try {
    const deleteDeliveries = await deliveryAm.findByIdAndDelete(req.params.id);
    return res.json(deleteDeliveries);
  } catch (err) {
    res.status(500).json({ message: "internal server error" });
  }
};
