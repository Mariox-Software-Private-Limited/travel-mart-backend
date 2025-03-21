import * as nodemailer from 'nodemailer';

export async function sendEmail(to: string, subject: string, text: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Trip69 Admin" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });

  console.log(`📩 Email sent to ${to}`);
}
