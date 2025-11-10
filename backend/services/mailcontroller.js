import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { AppDataSource } from "../DB/dataSource.js";
import { MailEvent } from "../models/mailEvent.js";
import { MailRecord } from "../models/mailRecords.js";
import crypto from "crypto";

dotenv.config();

export class MailController {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
      logger: true, 
      debug: true,  
    });

    this.mailRecordRepository = AppDataSource.getRepository(MailRecord);
    this.mailEventRepository = AppDataSource.getRepository(MailEvent);
    this.backendUrl = process.env.BACKEND_URL;
  }

  validateEmailAddresses(emailList) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailList.every(email => emailRegex.test(email));
  }

  async verifySMTPConnection() {
    try {
      await this.transporter.verify();
      console.log("SMTP connection successful.");
      return { success: true, message: "SMTP connection successful" };
    } catch (err) {
      console.error("SMTP connection failed:", err);
      return { success: false, error: `SMTP connection failed: ${err.message}` };
    }
  }

  async createMailRecord({ user_id, companyName, to, cc, bcc, message }) {
    const trackingId = crypto.randomUUID();

    const mailRecord = new MailRecord();
    mailRecord.user_id = user_id;
    mailRecord.company_name = companyName;
    mailRecord.to_emails = to.join(",");
    mailRecord.cc_emails = cc.join(",");
    mailRecord.bcc_emails = bcc.join(",");
    mailRecord.message = message;
    mailRecord.tracking_id = trackingId;

    const savedMailRecord = await this.mailRecordRepository.save(mailRecord);
    return { savedMailRecord, trackingId };
  }
  async logMailEvent(user_id, form_id, event_type = "sent") {
    const mailEvent = new MailEvent();
    mailEvent.user_id = user_id;
    mailEvent.form_id = form_id;
    mailEvent.event_type = event_type;
    await this.mailEventRepository.save(mailEvent);
  }

  buildEmailHTML(companyName, message, trackingId) {
    const trackOpenUrl = `${this.backendUrl}/track-open/${trackingId}`;
    const trackClickUrl = `${this.backendUrl}/track-click/${trackingId}`;

    return `
      <div style="font-family:Arial,sans-serif;color:#333;">
        <h2 style="color:#1976d2;">${companyName}</h2>
        <p>${message.replace(/\n/g, "<br/>")}</p>
        <p>
          <a href="${trackClickUrl}" target="_blank"
             style="background:#1976d2;color:white;padding:10px 15px;text-decoration:none;border-radius:6px;">
            View Mail
          </a>
        </p>
        <img src="${trackOpenUrl}" width="1" height="1" style="display:none;" />
        <p>Best Regards /n Your HR Team</p>
      </div>
    `;
  }

  async sendMail(req, res) {
    try {
      const { user_id, to, cc = [], bcc = [], companyName, message } = req.body;
      console.log("Received Mail Body:", req.body);
      if (!user_id || !to?.length || !companyName) {
        return res.status(400).json({
          success: false,
          error: "Missing user_id, to, or companyName",
        });
      }
      const allEmails = [...to, ...cc, ...bcc];
      if (!this.validateEmailAddresses(allEmails)) {
        return res.status(400).json({
          success: false,
          error: "One or more email addresses are invalid.",
        });
      }

      const smtpCheck = await this.verifySMTPConnection();
      if (!smtpCheck.success) {
        return res.status(500).json({
          success: false,
          error: smtpCheck.error,
        });
      }
      const { savedMailRecord, trackingId } = await this.createMailRecord({
        user_id,
        companyName,
        to,
        cc,
        bcc,
        message,
      });
      await this.logMailEvent(user_id, savedMailRecord.id, "sent");
      const html = this.buildEmailHTML(companyName, message, trackingId);
      await this.transporter.sendMail({
        from: `${companyName} <${process.env.MAIL_USER}>`,
        to,
        cc,
        bcc,
        subject: `Message from ${companyName}`,
        html,
      });
      return await res.json({
        message: "Mail sent successfully",
        trackingId,
      });
    } catch (err) {
      console.error("Mail send error:", err);
      return res
        .status(500)
        .json({ success: false, error: "Failed to send mail" });
    }
  }
}

export { MailController as MailService };
