const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

const corsOptions = {
  origin: "https://saiwealth.co.in", // Specify your domain here
  methods: "POST",
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));// Use CORS middleware to handle CORS
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true,
  auth: {
    user: "saiwealthadmin@saiwealth.co.in",
    pass: "Gully@!23",
  },
});

const createUserEmail = (username, useremail, password) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to PWD Training App</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                color: white ;
                margin: 0;
                padding: 0;
            }
            .email-container {
                max-width: 600px;
                margin: 20px auto;
                background-color: #DA8D45;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            .navbar {
                background-color: #DA8D45;
                padding: 20px;
                text-align: center;
                border-bottom: 2px solid white; /* Thin white border below logo */
            }
            .navbar img {
                max-width: 150px;
            }
            .content {
                padding: 30px ;
                color: white !important;
                text-align: center;
            }
            .content h1 {
                font-size: 28px;
                margin: 20px 0;
            }
            .content p {
                font-size: 16px;
                line-height: 1.6;
            }
            .icon {
                font-size: 50px;
                margin-bottom: 20px;
            }
            .cta-button {
                display: inline-block;
                margin-top: 20px;
                padding: 12px 24px;
                background-color: #fff !important;
                color: #DA8D45 !important;
                text-decoration: none !important;
                border-radius: 4px;
                font-weight: bold;
            }
            .account-details {
                background-color: #ffffff;
                color: #333333;
                padding: 30px;
                text-align: left;
            }
            .account-details h1 {
                color: #DA8D45;
            }
            .account-details p {
                line-height: 1.6;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="navbar">
                <img src="https://firebasestorage.googleapis.com/v0/b/mlmproject-a1727.appspot.com/o/Screenshot_2024-09-24_111325-removebg-preview.png?alt=media&token=802f24a0-4eaf-41ed-8127-bc7cd81e693c" alt="PWD Training App Logo">
            </div>
            <div class="content">
                <div class="icon">👋</div>
                <h1>WELCOME ABOARD!</h1>
                <p>We are thrilled to have you join the SAICART App!</p>
                <p>We’ll be in touch</p>
                <a href="https://saiwealth.co.in/" class="cta-button">Visit SAICART App</a>
            </div>
            <div class="account-details">
                <p>Dear <strong>${username}</strong>,</p>
                <p>We are excited to inform you that your account has been successfully created on the SAICART App. Below are your login details:</p>
                <p><strong>User email:</strong> ${useremail}</p>
                <p><strong>Password:</strong> ${password}</p>
                <p>To ensure that your profile is complete, please log in to your account using the app or the web application and update your details. This is an important step in gaining full access to the SAICART platform.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

app.post("/welcome_event", async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res
      .status(400)
      .send({ error: "email, username, and password parameters are required" });
  }

  const htmlContent = createUserEmail(username, email, password);

  try {
    let info = await transporter.sendMail({
      from: "saiwealthadmin@saiwealth.co.in", // Sender address
      to: email, // List of receivers
      subject: "Login credentials", // Subject line
      html: htmlContent, // HTML body content
    });

    console.log("Message sent: %s", info.messageId);
    res.status(200).send({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send({ error: "Failed to send email" });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
