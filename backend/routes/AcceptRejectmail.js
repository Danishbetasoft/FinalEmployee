import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { MailRecord } from '../models/mailRecords.js';
import { AppDataSource } from '../DB/dataSource.js';


const mailRepo = AppDataSource.getRepository(MailRecord)
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const sendEmail = async (to, subject, text, html) => {
  const mailOptions = {
    from: `${process.env.MAIL_USER}`,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}: ${info.response}`);
    return info;
  } catch (err) {
    console.error(`Failed to send email to ${to}:`, err);
    throw err;
  }
};

const sendAcceptanceEmail = async (employee) => {
    console.log(employee)
    try {
      const emp = await mailRepo.findOne({ where: { user_id: employee.id } })
  
      if (!emp) {
        throw new Error(`Mail record not found for employee with ID: ${employee.id}`)
      }
  
      const subject = 'Congratulations! You Have Been Selected'
      const text = `Hello ${employee.username}, We are thrilled to inform you that your application has been accepted! Welcome to the team — we’re excited to have you onboard. You can now log in using the following credentials: Email: ${employee.email} Password: ${employee.password} Best regards, ${emp.company_name}`
      const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto;">
          <h2 style="color: #2E86C1;">Congratulations, ${employee.username}!</h2>
          <p>We’re happy to inform you that your application has been <strong>accepted</strong>.</p>
          <p>Welcome to the team — we’re thrilled to have you onboard.</p>
          <div style="background-color: #f9f9f9; border: 1px solid #ddd; padding: 10px; border-radius: 6px;">
            <p><strong>Your login credentials:</strong></p>
            <p>Email: <strong>${employee.email}</strong></p>
            <p>Password: <strong>${employee.password}</strong></p>
          </div>
          <p style="margin-top: 20px;">You can now log in and start your journey with us.</p>
          <p style="margin-top: 20px;">Best regards,<br><strong>${emp.company_name}</strong></p>
        </div>
      `
  
      return sendEmail(employee.email, subject, text, html)
    } catch (err) {
      console.error('Error sending acceptance email:', err)
      throw err
    }
  }
  
  

  const sendRejectionEmail = async (employee, reason) => {
    try {
      const emp = await mailRepo.findOne({ where: { user_id: employee.id } });
  
      if (!emp) {
        throw new Error(`Mail record not found for employee with ID: ${employee.id}`);
      }
  
      const subject = 'Application Status: Rejected';
      const text = `Dear ${employee.username},\n\nWe regret to inform you that your application was not successful at this time. Reason: ${reason || 'Not specified'}.\n\nWe truly appreciate your interest in joining our team and wish you all the best in your future endeavors.\n\nBest regards`;
      const html = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h3 style="color: #C0392B;">Dear ${employee.username},</h3>
          <p>We regret to inform you that your application has been <strong>rejected</strong>.</p>
          <p><strong>Reason:</strong> ${reason || 'Not specified'}</p>
          <p>We truly appreciate your interest in joining our team and wish you all the best in your future endeavors.</p>
          <p style="margin-top: 20px;">Best regards,<br><strong>${emp.company_name}</strong></p>
        </div>
      `;
  
      return sendEmail(employee.email, subject, text, html);
  
    } catch (err) {
      console.error('Error sending rejection email:', err);
      throw err;
    }
  };
  
export { sendAcceptanceEmail, sendRejectionEmail };
