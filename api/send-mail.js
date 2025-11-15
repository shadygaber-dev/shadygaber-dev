import nodemailer from "nodemailer";
import path from "path";

// ===============================
//  ADMIN EMAIL TEMPLATE
// ===============================

function adminTemplate({ name, email, subject, message }) {
  return `
  <div style="font-family:Arial, sans-serif; background:#f5f5f5; padding:25px;">
    <div style="max-width:600px; margin:auto; background:#fff; padding:25px; border-radius:12px; border:1px solid #eee;">
      
      <div style="text-align:center; margin-bottom:20px;">
        <a href="https://shadygaber.dev">
          <img src="cid:logo" alt="Shady Gaber Logo" style="width:120px;">
        </a>
      </div>

      <h2 style="margin-top:0; color:#000;">📬 New Contact Form Submission</h2>
      
      <p style="font-size:15px;"><strong>Name:</strong> ${name}</p>
      <p style="font-size:15px;"><strong>Email:</strong> ${email}</p>
      <p style="font-size:15px;"><strong>Subject:</strong> ${subject}</p>

      <p style="font-size:15px; margin-top:20px;"><strong>Message:</strong></p>
      <div style="background:#fafafa; padding:15px; border-radius:8px; border:1px solid #ddd; font-size:14px;">
        ${message}
      </div>

      <hr style="margin:30px 0; border:none; border-top:1px solid #eee;" />

      <div style="text-align:center;">
        <p style="font-size:13px; color:#777;">Sent from shadygaber.dev</p>

        <div style="margin-top:20px;">
          <img src="cid:github" width="22" style="margin-right:10px;">
          <img src="cid:linkedin" width="22" style="margin-right:10px;">
          <img src="cid:instagram" width="22">
        </div>
      </div>

    </div>
  </div>
`;
}

// ===============================
//  AUTO-REPLY TEMPLATE
// ===============================

function autoReplyTemplate({ name, message }) {
  return `
  <div style="font-family:Arial, sans-serif; background:#f5f5f5; padding:25px;">
    <div style="max-width:600px; margin:auto; background:#fff; padding:25px; border-radius:12px; border:1px solid #eee;">
      
      <div style="text-align:center; margin-bottom:20px;">
        <a href="https://shadygaber.dev">
          <img src="cid:logo" alt="Logo" style="width:120px;">
        </a>
      </div>

      <h2 style="color:#000; margin-top:0;">Thank You for Reaching Out!</h2>

      <p style="font-size:15px;">
        Hello ${name},<br><br>
        Thank you for your message — I have received it successfully.
        I will get back to you as soon as possible.
      </p>

      <div style="background:#fafafa; padding:15px; border-radius:8px; border:1px solid #ddd; font-size:14px;">
        <strong>Your message:</strong><br><br>
        ${message}
      </div>

      <hr style="margin:30px 0; border:none; border-top:1px solid #eee;" />

      <div style="text-align:center; font-size:13px;">
        <p>Shady Gaber – Frontend Developer</p>
        <a href="https://shadygaber.dev" style="text-decoration:none; font-weight:bold; color:#000;">
          shadygaber.dev
        </a>

        <div style="margin-top:20px;">
          <img src="cid:github" width="22" style="margin-right:10px;">
          <img src="cid:linkedin" width="22" style="margin-right:10px;">
          <img src="cid:instagram" width="22">
        </div>
      </div>

    </div>
  </div>
`;
}

// ===============================
//  MAIN API HANDLER
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

    // Attachments from public/
    const attachments = [
      {
        filename: "logo.svg",
        path: path.join(process.cwd(), "assets", "images", "logo.svg"),
        cid: "logo",
      },
      {
        filename: "github.svg",
        path: path.join(process.cwd(), "assets", "images", "github.svg"),
        cid: "github",
      },
      {
        filename: "linkedin.svg",
        path: path.join(process.cwd(), "assets", "images", "linkedin.svg"),
        cid: "linkedin",
      },
      {
        filename: "instagram.svg",
        path: path.join(process.cwd(), "assets", "images", "instagram.svg"),
        cid: "instagram",
      },
    ];

    // ===============================
    //  SEND EMAIL TO YOU
    // ===============================
    await transporter.sendMail({
      from: `Portfolio Contact <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER,
      subject: `New Message from ${name}`,
      html: adminTemplate({ name, email, subject, message }),
      attachments,
    });

    // ===============================
    //  AUTO-REPLY EMAIL
    // ===============================
    await transporter.sendMail({
      from: `Shady Gaber <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Thanks for contacting me!",
      html: autoReplyTemplate({ name, subject, message }),
      attachments,
    });

    return res.status(200).json({ message: "Emails sent successfully" });
  } catch (error) {
    console.error("Zoho SMTP Error:", error.message);
    return res.status(500).json({ message: "Failed to send email" });
  }
}
