import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import expressAsyncHandler from "express-async-handler";
export const protect = expressAsyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (err) {
      res.status(401);
      throw new Error("Not authorized/ no token.");
    }
  }
});
