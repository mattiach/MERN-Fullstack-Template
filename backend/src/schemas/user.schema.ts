import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { ErrorType } from "../enums/const.js";

const userSchema: Schema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "Username is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email must be unique"], // ensure email is unique
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    verified: {
      type: Boolean,
      default: false, // default is false
    },
  },
  { timestamps: true } // automatically add 'createdAt' and 'updatedAt' fields
);

// hash the password before saving the user document
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // hash the password if it's modified

  try {
    const salt = await bcrypt.genSalt(12);

    if (typeof salt !== "string") {
      throw new Error(ErrorType.SALT_IS_NOT_A_STRING);
    }

    this.password = await bcrypt.hash(this.password as string, salt); // hash the password
    next();
  } catch (error: unknown) {
    next(error as Error);
  }
});

// compare entered password with stored hashed password
userSchema.methods.matchPasswords = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default userSchema;
