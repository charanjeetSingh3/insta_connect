import mongoose from "mongoose";
import bcrypt from "bcryptjs";
// to handle users
const userSchemas = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
      required: true,
      default: "./profile/def_avatar.jpg",
    },
  },
  { timestamps: true }
);

userSchemas.methods.matchPassword = async function (enteredPassword, password) {
  return await bcrypt.compare(enteredPassword, this.password);
};
userSchemas.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(5);
  this.password = await bcrypt.hash(this.password, salt);
});
const User = mongoose.model("User", userSchemas);
export default User;
