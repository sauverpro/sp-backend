const passwordGenerator = require("password-generator");
import { stationModel, userModel } from "../../models";
import {
  comparePassword,
  generateToken,
  hashPassword,
  transporter,
} from "../../utils";
import { v2 as cloudinary } from "cloudinary";
const { CLOUD_NAME, API_KEY, API_SECRETE } = process.env;
cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRETE,
});
// register User
export const RegisterUser = async (req, res) => {
  if (req.body.Role == "Admin") {
    try {
      let checkAdmin = await userModel.findOne({ Email: req.body.Email });
      if (checkAdmin) {
        return res.status(409).json({ message: "Email already exist" });
      }
      let hash = await hashPassword(req.body.Password);

      let newAdmin = await userModel.create({
        ...req.body,
        Password: hash,
      });

      if (!newAdmin) {
        return res.status(403).json({
          message: "Ooops signup failed!! try again later",
        });
      }
      // Email configuration
      const mailOptions = {
        from: "sauveur.dev@gmail.com",
        to: newAdmin.Email,
        subject: `Welcome to SP GAS Platform`,
        text: `Dear ${newAdmin.FullNames},\n You are now registered as an ADMIN on our platform. Now you can login with this credentials : \n Username: ${newAdmin.Email}\n Password: ${req.body.Password}`,
      };
      console.log(mailOptions);
      await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          return res.json({ success: false });
        }
        console.log("Email sent: " + info);
        res.status(201).json({
          message: "Admin registered successfully",
          success: true,
          data: {
            Email: newAdmin.Email,
            fullName: newAdmin.FullNames,
            Role: newAdmin.Role,
          },
        });
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "internal server error",
      });
    }
  } else {
    try {
      let checkCustomer = await userModel.findOne({ Email: req.body.Email });
      if (checkCustomer) {
        return res.status(409).json({ message: "Email already exist" });
      }
      let hash = await hashPassword(req.body.Password);

      let newCustomer = await userModel.create({
        ...req.body,
        Password: hash,
      });

      if (!newCustomer) {
        return res.status(403).json({
          message: "Ooops signup failed!! try again later",
        });
      }
      // Email configuration
      const mailOptions = {
        from: "sauveur.dev@gmail.com",
        to: newCustomer.Email,
        subject: `Welcome to SP GAS Platform`,
        text: `Dear ${newCustomer.FullNames},\n You are most welcome to our platform. Now you can login with this credentials : \n Username: ${newCustomer.PhoneNumber}\n Password: ${req.body.Password}`,
      };
      console.log(mailOptions);
      await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          return res.json({ success: false });
        }
        console.log("Email sent: " + info);
        res.status(201).json({
          message: "Customer registered successfully",
          success: true,
          data: {
            Email: newCustomer.Email,
            fullName: newCustomer.FullNames,
            Role: newCustomer.Role,
          },
        });
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "internal server error",
      });
    }
  }
};

// end of User registration

// .............................................................................

export const registerManager = async (req, res) => {
  try {
    let checkUser = await userModel.findOne({ Email: req.body.Email });
    if (checkUser) {
      return res.status(409).json({ message: "Email already exist" });
    }
    const image =
      "https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Blank&hairColor=Black&facialHairType=Blank&clotheType=BlazerSweater&eyeType=Default&eyebrowType=Default&mouthType=Serious&skinColor=Brown";
    const password = passwordGenerator(8, false);

    const hash = await hashPassword(password);
    console.log(
      "Generated Password:",
      password,
      "\n hushed password:",
      hash,
      "\n image: ",
      image
    );
    req.body.Role = "Manager";
    const newUser = await userModel.create({
      ...req.body,
      Profile: image,
      Password: hash,
    });

    if (!newUser) {
      return res.status(403).json({
        message: "Ooops failed to register User!! Try again later",
      });
    }
    // Email configuration
    const mailOptions = {
      from: "sauveur.dev@gmail.com",
      to: newUser.Email,
      subject: `Welcome to SP GAS Platform`,
      text: `Dear ${newUser.FullNames},\n You are now registered as an Manager on our platform. Now you can login with this credentials : \n Username: ${newUser.PhoneNumber}\n Password: ${password}`,
    };
    console.log(mailOptions);
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.json({ success: false });
      }
      console.log("Email sent: " + info);
      res.status(201).json({
        message: "User registered successfully",
        success: true,
        data: {
          Email: newUser.Email,
          fullName: newUser.FullNames,
          Role: newUser.Role,
        },
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "internal server error",
    });
  }
};
// .............................................................................

// ..........................................................................
// User login
export const loginUser = async (req, res) => {
  try {
    let User = await userModel.findOne({ PhoneNumber: req.body.PhoneNumber });
    if (!User) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    let comparedPassword = await comparePassword(
      req.body.Password,
      User.Password
    );
    if (!comparedPassword) {
      return res.status(401).json({
        message: "Wrong password",
      });
    }
    let token = generateToken({
      _id: User._id,
      FullName: User.FullName,
    });
    req.headers.authorization = token;
    console.log("token", req.headers.authorization);
    if (User?.Role === "Manager") {
      let Station = await stationModel.findOne({ managerId: User._id });
      if (!Station) {
        return res.status(404).json({
          message: "Station doesn't found",
        });
      }
     return res.status(200).json({
        message: "Login Successfully",
        access_token: token,
        data: {
          _id: User._id,
          Email: User.Email,
          fullName: User.FullNames,
          Role: User.Role,
          StationId: Station._id,
        },
      });
    }
    return res.status(200).json({
      message: "Login Successfully",
      access_token: token,
      data: {
        _id: User._id,
        Email: User.Email,
        fullName: User.FullNames,
        Role: User.Role,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "internal server error",
    });
  }
};
// end of login
//   ........................................................................

export const getUserById = async (req, res) => {
  try {
    const id = req.params.userId;
    let User = await userModel.findById(id);
    if (!User) {
      return res.status(404).json({
        message: "User doesn't found",
      });
    }
    res.status(200).json({
      message: "User founded",
      data: User,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      message: "internal server error",
    });
  }
};

// End of Getting Single User Details
//   ........................................................................
// Getting all Users

export const getAllUsers = async (req, res) => {
  try {
    let data = await userModel.find();
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

// End of Getting all Users Details
//   ........................................................................
// Getting all Users

export const getAllManagers = async (req, res) => {
  try {
    const managerQuery = { Role: "Manager" };
    let data = await userModel.find(managerQuery);
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

// End of Getting all Users Details
//   ...................................................................

// ..........................................................................

// Update User details

export const updateUser = async (req, res) => {
  try {
    const updateId = req.userId;
    console.log("UserId", updateId);
    const newData = req.body;
    const User = await userModel.findByIdAndUpdate(updateId, newData);
    if (User) {
      res.status(200).json({
        status: 200,
        message: "updated well",
        data: User,
      });
    } else {
      res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
};

// End
// ..........................................................................

// Update User details

export const updateUserProfile = async (req, res) => {
  try {
    const updateId = req.userId;
    console.log("UserId", updateId);
    const image = req.file;
    let profile = await cloudinary.uploader.upload(image.path);
    console.log("image", profile.secure_url);
    const User = await userModel.findByIdAndUpdate(updateId, {
      Profile: profile.secure_url,
    });
    if (!User) {
      return res.status(404).json({
        status: 404,
        message: "Failed to update profile",
      });
    }
    return res.status(200).json({
      status: 200,
      message: "Profile updated well",
      data: User,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: error.message,
    });
  }
};

// End
// ..........................................................................

// Delete User

export const deleteUser = async (req, res) => {
  try {
    const id = req.params.userId;
    console.log(id);
    let data = await userModel.findByIdAndDelete({ _id: id });
    if (!data) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully:", data: data });
    console.log("User deleted successfully:", data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

// End
// update location

export const updateLocation = async (req, res) => {
  try {
    const id = req.userId;
    let idLocation = await userModel.findById(id);
    let newLocation = req.body.Location;
    idLocation.Location.push(newLocation);
    await idLocation.save();
    console.log("user", idLocation);
    res.status(200).json({
      message: "user successfully  inserted a new location in the array",
      data: idLocation,
    });
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ message: "internal server error" });
  }
};

//update Number

export const updateNum = async (req, res) => {
  try {
    const id = req.userId;
    let idNum = await userModel.findById(id);
    let newNum = req.body.PhoneNumber;
    idNum.PhoneNumber.push(newNum);
    await idNum.save();
    console.log("user", idNum);
    res.status(200).json({
      message: "user successfully inserted a new number ",
      data: idNum,
    });
  } catch (err) {
    console.log("error", err);
    res.status(500).json({ message: "internal server error" });
  }
};
