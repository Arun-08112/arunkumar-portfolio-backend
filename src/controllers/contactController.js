import nodemailer from "nodemailer";
import { pool } from "../config/db.js";

const clean = (value) => (typeof value === "string" ? value.trim() : "");
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[+0-9() .-]{7,30}$/;
let transporter;
function mailer() {
  if (!transporter)
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    });
  return transporter;
}
function escapeHtml(value) {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
}
export async function submitContact(req, res, next) {
  const { website } = req.body ?? {};
  if (website)
    return res
      .status(200)
      .json({ success: true, message: "Thank you for your message." });
  const name = clean(req.body?.name);
  const email = clean(req.body?.email);
  const phone = clean(req.body?.phone);
  const message = clean(req.body?.message);
  if (
    !name ||
    name.length > 150 ||
    !emailRegex.test(email) ||
    email.length > 255 ||
    !phoneRegex.test(phone) ||
    message.length < 10 ||
    message.length > 5000
  ) {
    return res
      .status(400)
      .json({
        success: false,
        message:
          "Enter a valid name, email, phone number, and message (10–5000 characters).",
      });
  }
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASSWORD ||
    !process.env.MAIL_FROM ||
    !process.env.MAIL_TO
  ) {
    return res
      .status(503)
      .json({
        success: false,
        message: "Contact form email service is not configured yet.",
      });
  }
  try {
    // Never place a visitor-supplied address in "from". Use replyTo instead.
    const emailResult = await mailer().sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO,
      replyTo: { name, address: email },
      subject: "New portfolio inquiry",
      text: `New portfolio inquiry\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`,
      html: `<h2>New portfolio inquiry</h2><p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Phone:</strong> ${escapeHtml(phone)}</p><h3>Message</h3><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
    });
    if (!emailResult.accepted?.length)
      throw new Error("SMTP server did not accept the recipient");
    try {
      await pool.query(
        `INSERT INTO contact_messages (sender_name, sender_email, phone_number, subject, message, is_read) VALUES ($1,$2,$3,$4,$5,FALSE)`,
        [name, email, phone, "Portfolio inquiry", message],
      );
    } catch (dbError) {
      console.error(
        "Email was accepted but saving contact message failed:",
        dbError,
      );
      // Email has already been accepted: do not tell the visitor to retry and send a duplicate.
    }
    return res
      .status(201)
      .json({
        success: true,
        message: "Thank you! Your message has been submitted successfully.",
      });
  } catch (error) {
    console.error("Contact email error:", error.message);
    return res
      .status(502)
      .json({
        success: false,
        message:
          "Unable to send your message right now. Please try again later.",
      });
  }
}
