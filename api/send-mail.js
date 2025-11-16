import nodemailer from "nodemailer";

// ===============================
//  URLs FOR LOGOS (from GitHub RAW)
// ===============================
const LOGO_URL =
  "https://raw.githubusercontent.com/shadygaber-dev/shadygaber-dev/refs/heads/main/assets/images/logo.svg";

const GITHUB_URL =
  "https://raw.githubusercontent.com/shadygaber-dev/shadygaber-dev/refs/heads/main/assets/images/github.svg";

const LINKEDIN_URL =
  "https://raw.githubusercontent.com/shadygaber-dev/shadygaber-dev/refs/heads/main/assets/images/linkedin.svg";

const INSTAGRAM_URL =
  "https://raw.githubusercontent.com/shadygaber-dev/shadygaber-dev/refs/heads/main/assets/images/instagram.svg";

// ===============================
//  ADMIN TEMPLATE
// ===============================
function adminTemplate({ name, email, subject, message }) {
  return `
  <div style="font-family:Arial;background:#f5f5f5;padding:25px;">
    <div style="max-width:650px;margin:auto;background:#fff;padding:25px;border-radius:12px;border:1px solid #eee;">

      <div style="text-align:center;margin-bottom:20px;">
        <a href="https://shadygaber.dev">
          <img src="${LOGO_URL}" alt="Shady Gaber Logo" style="width:120px;">
        </a>
      </div>

      <h2 style="margin-top:0;color:#000;">📬 New Contact Form Submission</h2>

      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Subject:</strong> ${subject}</p>

      <div style="margin-top:20px;background:#fafafa;padding:15px;border-radius:8px;border:1px solid #ddd;">
        <strong>Message:</strong><br><br>
        ${message}
      </div>

      <hr style="margin:30px 0;border:none;border-top:1px solid #eee;">

      <div style="text-align:center;">
        <p style="font-size:13px;color:#777;">Sent from shadygaber.dev</p>

        <div style="margin-top:15px;">
          <img src="${GITHUB_URL}" width="22" style="margin-right:10px;">
          <img src="${LINKEDIN_URL}" width="22" style="margin-right:10px;">
          <img src="${INSTAGRAM_URL}" width="22">
        </div>
      </div>

    </div>
  </div>
  `;
}

// ===============================
//  AUTO REPLY TEMPLATE
// ===============================
function autoReplyTemplate({ name, message }) {
  return `
  <div style="font-family:Arial;background:#f5f5f5;padding:25px;">
    <div style="max-width:650px;margin:auto;background:#fff;padding:25px;border-radius:12px;border:1px solid #eee;">

      <div style="text-align:center;margin-bottom:20px;">
        <a href="https://shadygaber.dev">
          <img src="${LOGO_URL}" alt="Logo" style="width:120px;">
        </a>
      </div>

      <h2 style="margin-top:0;color:#000;">Thanks for Reaching Out!</h2>

      <p>
        Hello ${name},<br><br>
        Thank you for your message 😊  
        I’ve received it successfully and I’ll get back to you as soon as possible.
      </p>

      <div style="margin-top:20px;background:#fafafa;padding:15px;border-radius:8px;border:1px solid #ddd;">
        <strong>Your message:</strong><br><br>
        ${message}
      </div>

      <hr style="margin:30px 0;border:none;border-top:1px solid #eee;">

      <div style="text-align:center;font-size:13px;">
        <p>Shady Gaber – Frontend Developer</p>
        <a href="https://shadygaber.dev" style="text-decoration:none;color:#000;font-weight:bold;">
          shadygaber.dev
        </a>

        <div style="margin-top:15px;">
          <img src="${GITHUB_URL}" width="22" style="margin-right:10px;">
          <img src="${LINKEDIN_URL}" width="22" style="margin-right:10px;">
          <img src="${INSTAGRAM_URL}" width="22">
        </div>
      </div>

    </div>
  </div>
  `;
}

// ===============================
//  MAIN HANDLER
// ===============================
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { name, email, subject, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // ===============================
    //  SEND TO YOU
    // ===============================
    await transporter.sendMail({
      from: `Portfolio Contact <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: `New Message from ${name}`,
      html: adminTemplate({ name, email, subject, message }),
    });

    // ===============================
    //  AUTO REPLY
    // ===============================
    await transporter.sendMail({
      from: `Shady Gaber <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Thanks for contacting me! ✔",
      html: autoReplyTemplate({ name, message }),
    });

    return res.status(200).json({ message: "Emails sent successfully" });
  } catch (err) {
    console.error("SMTP Error:", err.message);
    return res.status(500).json({ message: "Failed to send email" });
  }
}
