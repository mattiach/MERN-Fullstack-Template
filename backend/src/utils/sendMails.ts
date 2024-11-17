import nodemailer, { SendMailOptions } from "nodemailer";
import { Response } from "express";
import { ErrorType } from "../enums/const.js";

export const sendMails = (res: Response, mailBody: SendMailOptions): void => {
  try {
    // setting up the transporter with gmail service and authentication
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.AUTH_EMAIL as string,
        pass: process.env.AUTH_PASSWORD as string,
      },
    });

    // sending the email using the provided mailBody configuration
    transporter.sendMail(mailBody);
  } catch (error) {
    // if an error occurs, send a 500 status and throw an error
    res.status(500);
    throw new Error(ErrorType.VERIFICATION_ERROR);
  }
};
