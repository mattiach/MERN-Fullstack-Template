import mongoose, { Schema } from "mongoose";

const userVerificationSchema: Schema = new mongoose.Schema(
  {
    userId: String,
    uniqueString: String,
  },
  { timestamps: true }
);

export default userVerificationSchema;