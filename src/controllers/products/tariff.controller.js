import { tariffModel } from "../../models";

// register Tariff
export const addTariff = async (req, res) => {
  try {
    const Price = Number(req.body.Price)
    console.log(typeof(Price));
    let newTariff = await tariffModel.create({Price: Price});
    if (!newTariff) {
      return res.status(403).json({
        message: "Failed to add new Tariff!! Try again later",
      });
    }
    return res.status(201).json({
      message: "Tariff added successfully",
      success: true,
      data: Price //newTariff,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const getAllTariff = async (req, res) => {
  try {
    let data = await tariffModel.find();
    if (!data) {
      return res.status(200).json({
        status: 200,
        data: data,
      });
    }
    return res.status(200).json({ status: 200, data: data });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
};

export const getTariffById = async (req, res) => {
  try {
    const id = req.params.tariffId;
    let Tariff = await tariffModel.findById(id);
    if (!Tariff) {
      return res.status(404).json({
        message: "Tariff doesn't found",
      });
    }
    res.status(200).json({
      message: "Tariff founded",
      data: Tariff,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
};

export const getLatestTariff = async (req, res) => {
    try {
      let Tariff = await tariffModel.findOne().sort({ _id: -1 });
      if (!Tariff) {
        return res.status(404).json({
          message: "Tariff doesn't found",
        });
      }
      res.status(200).json({
        message: "Tariff founded",
        data: Tariff,
      });
    } catch (error) {
      console.log("error", error);
      res.status(500).json({
        message: "internal server error",
        error: error.message,
      });
    }
  };
  

// Delete Tariff

export const deleteTariff = async (req, res) => {
  try {
    const id = req.params.tariffId;
    console.log(id);
    let data = await tariffModel.findByIdAndDelete({ _id: id });
    if (!data) {
      return res.status(404).json({ message: "Tariff not found" });
    }
    console.log("Tariff deleted successfully:", data);
    return res
      .status(200)
      .json({ message: "Tariff deleted successfully:", data: data });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: 500,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// End
