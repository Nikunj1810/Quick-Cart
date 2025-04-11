import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Determine if we're in production or development
const isProduction = process.env.NODE_ENV === 'production';

// Create a test account if no SMTP credentials are provided
const createTestAccount = async () => {
  const testAccount = await nodemailer.createTestAccount();
  return {
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  };
};

// Configure email transporter
const configureTransporter = async () => {
  // Check for SMTP credentials (in both production and development)
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    console.log('Using Gmail SMTP configuration');
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  
  // Fallback to Ethereal if no SMTP credentials are provided
  console.log('Using Ethereal test email service - emails will NOT be delivered to real inboxes');
  const config = await createTestAccount();
  
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.auth.user,
      pass: config.auth.pass,
    },
  });
};

/**
 * Send password reset email
 * @param {string} to - Recipient email address
 * @param {string} resetToken - Password reset token
 * @returns {Promise<Object>} - Email sending result
 */
export const sendPasswordResetEmail = async (to, resetToken) => {
  try {
    const transporter = await configureTransporter();
    
    const resetUrl = `http://localhost:8080/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: '"Quick Cart" <noreply@quickcart.com>',
      to,
      subject: 'Password Reset Instructions',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">Reset Your Password</h2>
          <p>You requested a password reset for your Quick Cart account.</p>
          <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin: 20px 0;">Reset Password</a>
          <p>If you didn't request this, please ignore this email.</p>
          <p>Thanks,<br>The Quick Cart Team</p>
        </div>
      `,
    };
    
    const info = await transporter.sendMail(mailOptions);
    
    // Log email sending status
    console.log('=========================================');
    console.log(`Email sent successfully to: ${to}`);
    console.log(`Message ID: ${info.messageId}`);
    console.log('=========================================');
    
    return {
      success: true,
      messageId: info.messageId,
      // Only include previewUrl if using Ethereal (test account)
      ...(info.envelope.from.includes('ethereal.email') ? { previewUrl: nodemailer.getTestMessageUrl(info) } : {}),
    };
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};