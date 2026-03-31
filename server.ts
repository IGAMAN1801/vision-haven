import express from "express";
import path from "path";
import nodemailer from "nodemailer";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check route
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // API route for contact form
  app.post("/api/contact", async (req, res) => {
    const { name, email, message, subject } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
      console.error("Email configuration missing: EMAIL_USER or EMAIL_PASS not set in environment variables.");
      return res.status(500).json({ 
        error: "Server configuration error: Email credentials are not set. Please configure EMAIL_USER and EMAIL_PASS in the Settings menu." 
      });
    }

    try {
      // Configure nodemailer
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: emailUser,
          pass: emailPass
        }
      });

      const mailOptions = {
        from: emailUser,
        to: process.env.RECIPIENT_EMAIL || 'amanshaikh200518@gmail.com', // Default to your verified email
        subject: `VisionHaven Contact: ${subject} from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\nMessage:\n${message}`,
        replyTo: email
      };

      await transporter.sendMail(mailOptions);
      res.json({ success: true, message: "Email sent successfully" });
    } catch (error: any) {
      console.error("Error sending email:", error);
      let errorMessage = "Failed to send email.";
      if (error.message.includes("Invalid login")) {
        errorMessage = "Invalid login: Gmail rejected your credentials. Please ensure you are using a 16-character App Password, not your regular password.";
      } else if (error.message.includes("EAUTH")) {
        errorMessage = "Authentication failed. Check your EMAIL_USER and EMAIL_PASS in the Settings menu.";
      } else {
        errorMessage = `Error: ${error.message}`;
      }
      res.status(500).json({ error: errorMessage });
    }
  });

  // API route for system reports
  app.post("/api/report", async (req, res) => {
    const { type, description, userEmail } = req.body;

    if (!type || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;

    if (!emailUser || !emailPass) {
      return res.status(500).json({ error: "Email configuration missing" });
    }

    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: emailUser, pass: emailPass }
      });

      const mailOptions = {
        from: emailUser,
        to: process.env.RECIPIENT_EMAIL || 'amanshaikh200518@gmail.com',
        subject: `VisionHaven System Report: ${type}`,
        text: `Report Type: ${type}\nUser Email: ${userEmail || 'Anonymous'}\n\nDescription:\n${description}`,
      };

      await transporter.sendMail(mailOptions);
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error sending report:", error);
      res.status(500).json({ error: "Failed to send report" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
