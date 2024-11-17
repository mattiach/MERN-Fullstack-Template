import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import User from "../models/user.model.js";
import UserVerification from "../models/user-verification.model.js";
import generateToken from "../utils/generateToken.util.js";
import { sendMails } from "../utils/sendMails.js";
import { ErrorType, TokenType } from "../enums/const.js";

// @Route   POST /api/users/auth
// @Access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (!userExists || !(await userExists.matchPasswords(password))) {
    res.status(401);
    throw new Error(ErrorType.INVALID_CREDENTIALS);
  }

  generateToken(res, userExists._id, TokenType.LOGIN);

  return res.status(200).json({
    _id: userExists._id,
    userName: userExists.userName,
    email: userExists.email,
    verified: userExists.verified,
  });
});

// @Route   POST /api/users
// @Access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error(ErrorType.USER_ALREADY_EXISTS);
  }

  const user = await User.create({
    userName,
    email,
    password,
  });

  if (!user) {
    res.status(400);
    throw new Error(ErrorType.USER_NOT_FOUND);
  }

  const userVerification = await UserVerification.create({
    userId: user._id,
    uniqueString: `${uuidv4()}${user._id}`,
  });


  const link = `${process.env.URL_SERVER}api/users/verify/${userVerification.uniqueString}`;
  const WEBSITE_NAME = process.env.WEBSITE_NAME;
  const URL_WEBSITE = process.env.URL_WEBSITE;

  const mailBody = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Account Verification",
    html: `
      <div>
        <p>Welcome!</p>
        <p>Thank you for registering at ${URL_WEBSITE}</p>
        <p>Verify your email address now by clicking: <a href=${link}><b>here</b></a></p>
        <p>Thank you! - The ${WEBSITE_NAME} team</p>
      </div>
    `,
  };

  sendMails(res, mailBody);

  return res.status(201).json({
    _id: user._id,
    userName: user.userName,
    email: user.email,
    verified: user.verified,
  });
});

// @Route   POST /api/users/logout
// @Access  Public
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  return res.status(200).json({
    message: "User successfully logged out",
  });
});

// @Route   GET /api/users/profile
// @Access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  return res.status(200).json({
    message: "View user profile",
    user: req.user,
  });
});

// @Route   PUT /api/users/profile
// @Access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const { userName, email, password } = req.body;
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error(ErrorType.USER_NOT_FOUND);
  }

  user.userName = userName || user.userName;
  user.email = email || user.email;

  if (password) user.password = password;

  const updatedUser = await user.save();

  return res.status(200).json({
    _id: updatedUser._id,
    userName: updatedUser.userName,
    email: updatedUser.email,
  });
});

// @Route   GET /api/users/verify/:uniqueString
// @Access  Public
const verifyUserEmail = asyncHandler(async (req, res) => {
  const { uniqueString } = req.params;
  const verifiedUser = await UserVerification.findOne({ uniqueString });

  if (!verifiedUser) {
    res.status(404);
    throw new Error(ErrorType.VERIFICATION_CODE_NOT_FOUND);
  }

  await User.findByIdAndUpdate(
    verifiedUser.userId,
    { verified: true },
    {
      runValidators: true,
      new: true,
    }
  );
  await UserVerification.findByIdAndDelete(verifiedUser._id);

  return res.end(
    `<h1>Account successfully verified! <a href="${process.env.URL_WEBSITE}login"><b>Log in now</b></a></h1>`
  );
});

// @Route   POST /api/users/forgot-password
// @Access  Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400);
    throw new Error(ErrorType.USER_NOT_FOUND);
  }

  const token = generateToken(res, user._id);

  const link = `${process.env.URL_WEBSITE}reset-password/${user._id}/${token}`;
  const mailBody = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Reset Password",
    html: `
      <div>
        <p>Hello ${user.userName}!</p>
        <p>Having trouble logging in? resetting your password is easy!</p>

        <p>
          Click the link below and follow the instructions. We'll have you up and running in no time.
          <br />
          <a href=${link}>Reset your password</a>
        </p>

        <p>Thank you - The ${process.env.WEBSITE_NAME} team</p>
      </div>
    `,
  };

  sendMails(res, mailBody);
  res.status(200).json({
    message: "Email successfully sent!",
  });
});

// @Route   PATCH /api/users/reset-password/:id/:token
// @Access  Private
const resetPassword = asyncHandler(async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  try {
    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded._id);
    user.password = password;
    const updatedUserPassword = await user.save();

    return res.status(200).json({
      _id: updatedUserPassword._id,
      userName: updatedUserPassword.userName,
      email: updatedUserPassword.email,
    });
  } catch (error) {
    res.status(403);
    throw new Error(ErrorType.UNAUTHORIZED_ACTION);
  }
});

// @Route   DELETE /api/users/delete
// @Access  Private
const deleteUserProfile = asyncHandler(async (req, res) => {
  try {
    await User.findByIdAndDelete(req.body._id);
    res.json({
      message: "Account successfully deleted"
    });
  } catch (error) {
    res.status(500);
    throw new Error(ErrorType.ERROR_DURING_REQUEST);
  }
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  verifyUserEmail,
  forgotPassword,
  resetPassword,
  deleteUserProfile,
};
