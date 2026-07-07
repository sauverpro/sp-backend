import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    let Auth = req.headers.authorization;
    let Token = Auth?.split(" ")[1];
    if (!Token) {
      return res.status(401).json({
        message: "no access token found",
      });
    }
    await jwt.verify(Token, process.env.JWT_SECRETE, (err, Verify) => {
      if (err) {
        return res.status(401).json({
          message: "Invalid token",
        });
      }
      req.userId = Verify._id;
      console.log("user id: ", req.userId);
      next();
    });
  } catch (error) {
    console.log("This is the error", error.message);
    res.status(500).json({
      message: "internal server error",
    });
  }
};
