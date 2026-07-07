import { stationModel, userModel } from "../../models";

// register Station
export const RegisterStation = async (req, res) => {
  try {
    const id = req.body.Manager;
    const stationManager = await userModel.findById(id);
    if (!stationManager) {
      return res.status(404).json({ message: "MANAGER DOES NOT EXIST" });
    }
    if (stationManager?.Role !== "Manager") {
      return res.status(403).json({
        message: "Please provide existing manager",
      });
    }
    let newStation = await stationModel.create({
      ...req.body,
      managerId: req.body.Manager,
    });
    if (!newStation) {
      return res.status(403).json({
        message: "Ooops failed to add new Station!! Try again later",
      });
    }
    res.status(201).json({
      message: "Station registered successfully",
      success: true,
      data: newStation,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "internal server error",
    });
  }
};

// end of Station registration

//   ........................................................................

// Getting Single customer Details

export const getStationById = async (req, res) => {
  try {
    const id = req.params.stationId;
    let Station = await stationModel.findById(id).populate("managerId");
    if (!Station) {
      return res.status(404).json({
        message: "Station doesn't found",
      });
    }
    res.status(200).json({
      message: "Station founded",
      data: Station,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: "internal server error",
    });
  }
};

// End of Getting Single Station Details
//   ........................................................................
// Getting all Stations

export const getAllStations = async (req, res) => {
  try {
    let data = await stationModel.find().populate("managerId");
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

// .......Station............................................................

// Delete Station

export const deleteStation = async (req, res) => {
  try {
    const id = req.params.stationId;
    console.log(id);
    let data = await stationModel.findByIdAndDelete({ _id: id });
    if (!data) {
      return res.status(404).json({ message: "Station not found" });
    }
    res
      .status(200)
      .json({ message: "Station deleted successfully:", data: data });
    console.log("Station deleted successfully:", data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

// End
