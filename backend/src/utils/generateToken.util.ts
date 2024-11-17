import jwt from "jsonwebtoken";
import { Response } from "express";
import { TokenType } from "../enums/const.js";

const generateToken = (
  res: Response,
  userId: string,
  type: TokenType = TokenType.RESET // default value
): string => {
  // setting expiration time based on token type
  const expiresIn = type === TokenType.LOGIN ? process.env.JWT_EXPIRES : "1d";

  // generating jwt token with user id and expiration
  const token = jwt.sign({ _id: userId }, process.env.JWT_SECRET_KEY as string, {
    expiresIn: expiresIn,
  });

  // if token is for login, setting it as an http-only cookie
  if (type === TokenType.LOGIN) {
    const cookieExpires = Number(process.env.COOKIE_EXPIRES_DAYS) * 24 * 60 * 60 * 1000;

    res.cookie("jwt", token, {
      maxAge: cookieExpires, // days
      httpOnly: process.env.NODE_ENV !== "development",
      secure: process.env.NODE_ENV !== "development", // https
      sameSite: "strict", // prevents csrf attacks
    });
  }

  return token;
};

export default generateToken;
