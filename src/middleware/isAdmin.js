import { userModel } from "../models";

export const isDriver = async (req, res, next) => {
  try {
    const user = req.userId;
    console.log(user);
    let users = await userModel.findById(user);
    if (!user) {
      return res.status(404).json({
        message: "Driver does not found",
      });
    }
    if (users?.Role !== "Driver") {
      return res.status(403).json({
        message:
          "You are not allowed to perform this action please log in as Driver and try again",
      });
    }
    next();
  } catch (error) {
    console.log("I got an error ", error);
    res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
};
export const isManager = async (req, res, next) => {
  try {
    const user = req.userId;
    console.log(user);
    let users = await userModel.findById(user);
    if (!user) {
      return res.status(404).json({
        message: "Manager does not found",
      });
    }
    if (users?.Role !== "Manager") {
      return res.status(403).json({
        message:
          "You are not allowed to perform this action please log in as Manager and try again",
      });
    }
    next();
  } catch (error) {
    console.log("I got an error ", error);
    res.status(500).json({
      message: "internal server error",
      error: error.message,
    });
  }
};
export const isAdmin = async (req, res, next) => {
  try {
    const user = req.userId;
    console.log(user);
    let users = await userModel.findById(user);
    if (!user) {
      return res.status(404).json({
        message: "Admin does not found",
      });
    }
    if (users?.Role !== "Admin") {
      return res.status(403).json({
        message:
          "You are not allowed to perform this action please log in as admin and try again",
      });
    }
    next();
  } catch (error) {
    console.log("I got an error ", error);
    res.status(500).json({
      message: "internal server error",
    });
  }
};
export const isManagerOrAdmin = async (req, res, next) => {
  try {
    const userId = req.userId;
    let user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const allowedRoles = ["Manager", "Admin"];
    
    if (!allowedRoles.includes(user.Role)) {
      return res.status(403).json({
        message: "You are not allowed to perform this action. Please log in as Manager or Admin and try again.",
      });
    }

    next();
  } catch (error) {
    console.error("Error in isManagerOrAdmin middleware:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};