import { tariffModel } from "../../models";
import { v2 as cloudinary } from "cloudinary";
const { CLOUD_NAME, API_KEY, API_SECRETE } = process.env;
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRETE,
});
// register Tariff
export const RegisterTariff = async (req, res) => {
  try {
    const existingKilos = await tariffModel.findOne({
      Kilograms: req.body.Kilograms,
    });
    if (existingKilos) {
      console.log("yes it is");
      const updatePrice = await tariffModel.findByIdAndUpdate(
        existingKilos._id,
        {
          UnitPrice: req.body.UnitPrice,
          TotalPrice: req.body.TotalPrice,
        }
      );
      if (!updatePrice) {
        return res.status(403).json({ message: "Failed to Update Prices" });
      }
      return res.status(201).json({
        status: true,
        message: "Tariff updated successfully",
        data: updatePrice,
      });
    } else {
      if (req.file) {
        const image = req.file;
        console.log("image", image);
        let profile = await cloudinary.uploader.upload(image.path);
        console.log("image", profile.secure_url);

        let newTariff = await tariffModel.create({
          ...req.body,
          Image: profile.secure_url,
        });
        if (!newTariff) {
          return res.status(403).json({
            message: "Failed to add new Tariff!! Try again later",
          });
        }
        return res.status(201).json({
          message: "Tariff registered successfully",
          success: true,
          data: newTariff,
        });
      }
      return res.status(404).json({ message: "Please provide image for gas" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error.message,
    });
  }
};

// end of Tariff registration

//   ........................................................................

// Getting Single customer Details

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
    });
  }
};

// End of Getting Single Tariff Details
//   ........................................................................
// Getting all Tariffs

export const getAllTariff = async (req, res) => {
  try {
    let data = await tariffModel.find();
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

// .......Tariff............................................................

// Delete Tariff

export const deleteTariff = async (req, res) => {
  try {
    const id = req.params.tariffId;
    console.log(id);
    let data = await tariffModel.findByIdAndDelete({ _id: id });
    if (!data) {
      return res.status(404).json({ message: "Tariff not found" });
    }
    res
      .status(200)
      .json({ message: "Tariff deleted successfully:", data: data });
    console.log("Tariff deleted successfully:", data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

// End
