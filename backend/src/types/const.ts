import { Document } from "mongoose";
import { ObjectId } from "mongodb";

export interface IUser extends Document {
  userName: string;
  email: string;
  password: string;
  verified: boolean;
  matchPasswords(enteredPassword: string): Promise<boolean>;
}

export interface IUserProfile {
  _id: ObjectId;
  userName: string;
  email: string;
  verified: boolean;
}

export interface IUserLoginCredentials {
  email: string;
  password: string;
}