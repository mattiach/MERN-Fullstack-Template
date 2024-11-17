import mongoose from "mongoose";
import { IUser } from "../types/const.js";
import userSchema from "../schemas/user.schema.js";

const User = mongoose.model<IUser>("User", userSchema);

export default User;
