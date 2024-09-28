import expressAsyncHandler from "express-async-handler";
import User from "../models/user.model.js";
import generateToken from "../config/generateToken.js";
export default class UserController {
  registerUser = expressAsyncHandler(async (req, res) => {
    const { name, email, password, picture } = req.body;
    if (!name || !email || !password || !picture) {
      return res
        .status(400)
        .json({ status: false, message: "Please enter all the fields" });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ status: false, message: "User already exists." });
    }
    const user = await User.create({
      name,
      email,
      password,
      picture,
    });
    if (user) {
      return res.status(201).json({
        status: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          picture: user.picture,
          token: generateToken(user._id),
        },
      });
    } else {
      return res
        .status(500)
        .json({ status: false, message: "Failed to create the user." });
    }
  });
  authUser = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({ success: false, message: "Invalid User." });
    }
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      return res.status(201).json({
        status: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          picture: user.picture,
          token: generateToken(user._id),
        },
      });
    } else {
      return res
        .status(401)
        .json({ success: false, message: "Invalid User Details." });
    }
  });
  allUsers = expressAsyncHandler(async (req, res) => {
    const keyword = req.query.search
      ? {
          $or: [
            {
              name: { $regex: req.query.search, $options: "i" },
            },
            {
              email: { $regex: req.query.search, $options: "i" },
            },
          ],
        }
      : {};
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
  });
}
