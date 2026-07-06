import nodemailer from "nodemailer"
import { injectable } from "inversify";
import { env } from "../../shared/constants/env";
import type { IMailService } from "../interfaces/Imail-service";
import { AppError } from "../../shared/utils/AppError";
import { HttpStatusCode } from "../../shared/constants/HttpStatusCodes";

@injectable()
export class MailService implements IMailService {
  private transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: env.EMAIL,
        pass: env.EMAIL_PASS
      },
      debug: true
    })
  }

  async sendOtpEmail(email: string, otp: string, otpExpireAt: string): Promise<{ message: string; otpExpireAt: string; }> {
    try {
      const html = `
<div style="font-family: 'Segoe UI', Arial, sans-serif; background:#f4f6f9; padding:40px;">

  <div style="max-width:520px; margin:auto; background:#ffffff; border-radius:14px; 
  border:1px solid #e5e7eb; padding:35px; box-shadow:0 8px 25px rgba(0,0,0,0.08);">

    <h2 style="text-align:center; color:#0f172a; margin-bottom:5px;">
      Asset Bridge
    </h2>

    <p style="text-align:center; color:#64748b; font-size:14px; margin-bottom:30px;">
      Secure Property Investment Platform
    </p>

    <h3 style="text-align:center; color:#1e293b; font-size:22px; margin-bottom:15px;">
      Email Verification
    </h3>

    <p style="color:#475569; font-size:15px; text-align:center; line-height:1.6; margin-bottom:25px;">
      To continue with your authentication process, please use the One Time Password (OTP) below.
    </p>

    <div style="
        background:#f1f5f9;
        border-radius:10px;
        padding:18px 30px;
        text-align:center;
        font-size:34px;
        color:#1e40af;
        letter-spacing:8px;
        font-weight:bold;
        border:2px dashed #93c5fd;
        width:fit-content;
        margin:0 auto 25px auto;
    ">
        ${otp}
    </div>

    <p style="font-size:14px; color:#475569; text-align:center; margin-bottom:8px;">
      This verification code will expire in
      <strong>${otpExpireAt} minutes</strong>.
    </p>

    <p style="font-size:13px; color:#64748b; text-align:center; line-height:1.5;">
      For your security, please do not share this code with anyone.
      Asset Bridge will never ask for your OTP.
    </p>

    <div style="margin-top:30px; padding-top:20px; border-top:1px solid #e2e8f0; text-align:center;">
      <p style="font-size:12px; color:#94a3b8; margin-bottom:5px;">
        If you did not request this verification, you can safely ignore this email.
      </p>

      <p style="font-size:12px; color:#cbd5e1;">
        © 2026 Asset Bridge · Secure Investment Infrastructure
      </p>
    </div>

  </div>

</div>
`;


      const mailOption = {
        from: env.EMAIL,
        to: email,
        subject: "VERIFICATION CODE FROM ASSET BRIDGE",
        html
      }


      await this.transporter.sendMail(mailOption)

      return {
        message: "OTP SENT SUCCESSFULLY",
        otpExpireAt
      }

    } catch (error) {
      throw new AppError(`OTP SEND FAILED PLEASE TRY AGAIN LATER. ${error}`, HttpStatusCode.BAD_REQUEST)
    }
  }


  async sendResetMail(
    email: string,
    Token: string
  ): Promise<{
    message: string;
    linkExpiresAt: string;
  }> {

    try {

      const linkExpiresAt = "5"

      const resetUrl =
        `${env.CLIENT_URL}/reset-password/${Token}`

      const html = `
<div style="font-family:'Segoe UI',Arial,sans-serif;background:#f4f6f9;padding:40px;">

  <div style="
    max-width:520px;
    margin:auto;
    background:#ffffff;
    border-radius:14px;
    border:1px solid #e5e7eb;
    padding:35px;
    box-shadow:0 8px 25px rgba(0,0,0,0.08);
  ">

    <h2 style="
      text-align:center;
      color:#0f172a;
      margin-bottom:5px;
    ">
      Asset Bridge
    </h2>

    <p style="
      text-align:center;
      color:#64748b;
      font-size:14px;
      margin-bottom:30px;
    ">
      Secure Property Investment Platform
    </p>

    <h3 style="
      text-align:center;
      color:#1e293b;
      font-size:22px;
      margin-bottom:15px;
    ">
      Password Reset Request
    </h3>

    <p style="
      color:#475569;
      font-size:15px;
      text-align:center;
      line-height:1.6;
      margin-bottom:30px;
    ">
      We received a request to reset your password.
      Click the button below to create a new password.
    </p>

    <div style="text-align:center;margin-bottom:30px;">

      <a href="${resetUrl}"
        style="
          background:#4f46e5;
          color:white;
          text-decoration:none;
          padding:14px 28px;
          border-radius:10px;
          display:inline-block;
          font-weight:600;
          font-size:15px;
        "
      >
        Reset Password
      </a>

    </div>

    <p style="
      font-size:14px;
      color:#475569;
      text-align:center;
      margin-bottom:8px;
    ">
      This password reset link will expire in
      <strong>${linkExpiresAt} minutes</strong>.
    </p>

    <p style="
      font-size:13px;
      color:#64748b;
      text-align:center;
      line-height:1.6;
    ">
      If you did not request a password reset,
      you can safely ignore this email.
    </p>

    <div style="
      margin-top:30px;
      padding-top:20px;
      border-top:1px solid #e2e8f0;
      text-align:center;
    ">

      <p style="
        font-size:12px;
        color:#94a3b8;
        margin-bottom:5px;
      ">
        For security reasons, this link can only be used once.
      </p>

      <p style="
        font-size:12px;
        color:#cbd5e1;
      ">
        © 2026 Asset Bridge · Secure Investment Infrastructure
      </p>

    </div>

  </div>

</div>
`

      const mailOption = {
        from: env.EMAIL,
        to: email,
        subject: "RESET YOUR PASSWORD - ASSET BRIDGE",
        html
      }

      await this.transporter.sendMail(mailOption)

      return {
        message:
          "RESET PASSWORD LINK SENT SUCCESSFULLY",
        linkExpiresAt
      }

    } catch (error) {

      throw new AppError(
        `RESET MAIL SEND FAILED. ${error}`,
        HttpStatusCode.BAD_REQUEST
      )
    }
  }
}