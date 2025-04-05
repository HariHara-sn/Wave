const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

// Create a transporter object
let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Gmail SMTP server
    port: 465, // 465 for SSL or 587 for TLS
    secure: true, // true for SSL
    auth: {
        user: "zdart2026@gmail.com", // Your Gmail email address
        pass: "yhsm mcfn brsm lwjh", // App Password (not your regular Gmail password)
    },
});
// Function to send email
const sendEmail = async (to, subject, text) => {
    try {
        // Define email options
        let info = await transporter.sendMail({
            from: '"LearnPro AI" <zdart2026@gmail.com>', // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            text: text, // plain text body
            html: `<p>${text}</p>`, // HTML body
        });

        logger.loggerSuccess(`Message sent: ${info.messageId}`);
        console
        return true;
    } catch (error) {
        logger.loggerError(`Error sending email: ${error}`);
        return false;
    }
};

const EmailConfig = async (email, mailHead, otp) => {
    try {
        let sendTo = email;
        let mail_subject;
        let mail_body;

        const emailStyles = `
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background-color: #f4f4f4;
                }
                .container {
                    max-width: 600px;
                    background-color: #ffffff;
                    border-radius: 10px;
                    padding: 25px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    margin: auto;
                    text-align: center;
                }
                h2 {
                    color: #333;
                    font-size: 24px;
                    margin-bottom: 15px;
                }
                p {
                    color: #555;
                    font-size: 16px;
                    line-height: 1.6;
                }
                .otp {
                    font-weight: bold;
                    font-size: 20px;
                    color: #007BFF;
                    background-color: #e9f5ff;
                    padding: 12px;
                    border-radius: 6px;
                    display: inline-block;
                    margin: 10px 0;
                }
                .footer {
                    margin-top: 20px;
                    font-size: 14px;
                    color: #888;
                }
                .brand {
                    font-weight: bold;
                    color: #007BFF;
                }
            </style>
        `;

        if (mailHead === 'OTP') {
            mail_subject = 'LearnPro AI - OTP';
            mail_body = `
                <html>
                    <head>${emailStyles}</head>
                    <body>
                        <div class="container">
                            <h2>Welcome to <span class="brand">LearnPro AI</span></h2>
                            <p>Hello <strong>${email}</strong>,</p>
                            <p>We received a request to log in or register with your account. Please use the following One-Time Password (OTP) to proceed:</p>
                            <p class="otp">${otp}</p>
                            <p>If you did not request this, please ignore this email.</p>
                            <p class="footer">Thank you,<br><strong>LearnPro AI Team</strong></p>
                        </div>
                    </body>
                </html>
            `;
        } else if (mailHead === 'deleteAccount') {
            mail_subject = 'LearnPro AI - Account Deletion';
            mail_body = `
                <html>
                    <head>${emailStyles}</head>
                    <body>
                        <div class="container">
                            <h2>Account Deletion Confirmation</h2>
                            <p>Hello <strong>${email}</strong>,</p>
                            <p>Your <span class="brand">Ion Hive</span> account has been successfully deleted.</p>
                            <p>If this was not requested by you, please contact our support team immediately.</p>
                            <p class="footer">Thank you,<br><strong>Ion Hive Support Team</strong></p>
                        </div>
                    </body>
                </html>
            `;
        }

        const result = await sendEmail(sendTo, mail_subject, mail_body);
        return result;
    } catch (error) {
        logger.loggerError(`Error sending email: ${error}`);
        return false;
    }
}



module.exports = { EmailConfig }