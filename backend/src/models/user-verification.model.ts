import mongoose from "mongoose";
import userVerificationSchema from "../schemas/user-verification.schema.js";

const UserVerification = mongoose.model("UserVerification", userVerificationSchema);

export default UserVerification;
