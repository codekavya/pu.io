import nodemailer from "nodemailer";
import config from "../config.js";
const { email, password, emailPort, emailHost } = config;

export const sendmail = async ({ from, to, subject, text, html }) => {
  let transporter = nodemailer.createTransport({
    host: emailHost,
    port: emailPort,
    secure: true, // true for 465, false for other ports
    auth: {
      user: email,
      pass: password,
    },
  });
  let info = await transporter.sendMail({
    from: from,
    to: to,
    subject: subject,
    text: text,
    html: html,
  });

  console.log("Message sent: %s", info.messageId);
};
