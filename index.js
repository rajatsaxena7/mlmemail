const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");
const admin = require("firebase-admin");

const app = express();

app.use(cors());
app.use(bodyParser.json());

const base64ServiceAccount =
  "ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3VudCIsCiAgInByb2plY3RfaWQiOiAibWxtcHJvamVjdC1hMTcyNyIsCiAgInByaXZhdGVfa2V5X2lkIjogIjU1ZDZmM2I1YmE5MjQ1ZDgyODAyMTgyZDE2MDBhODgyNTg2ZmJlNWMiLAogICJwcml2YXRlX2tleSI6ICItLS0tLUJFR0lOIFBSSVZBVEUgS0VZLS0tLS1cbk1JSUV2QUlCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQktZd2dnU2lBZ0VBQW9JQkFRRGgvTys2OXJycGk3NDdcbk9IZU05SnN5ZDBMa2Y1WHNxeG9OZFB5c2p2Mmh0WmVIOXVrRFp4NGtyUHRxQ0RFVVFXMzhLWGloVzJORXZvRWtcblNpYUE1VGtMRHdFMmdSMzg3QU5rY05kdzdhUXhMZnZwQnRrbzFSOWZ2Y1lrWXhsTGREaTBWaCtFNEhoT2ljNlJcbkJXNy9LYjVUeHFFWGJoUWh2Q0pQaytzWCtrb05aWGQvd1kwbGlKMEZ0Y0VQT09HSk0xSkU5UzVzN2duZk9PMjFcbjg5VDFnWmFoL3JFRElPcWZDbTFVaERQWWdnS2NzbjFSeUVXZSswR0N5dmd0U2VzUGpmQmQyM2FucGZ2ZFpGRzdcbko1Um1oblVvMFBmWE9BSWNqTEt3QXN3WnV1eEZKcDhUTVlOYUtiVjR5VmlZRU93MlkyWDlvMEs1T3BrNC8wejRcblJpKzVZbGEzQWdNQkFBRUNnZ0VBVlFFcS9hVXNOb2dSaEw0ZlBmNk9XQ1BESGljZHNsbkQ0WGIxU2tVNUF6aEdcbnFPYUh6SGRmdjhUdmh2bFEyTUVweVZXaUlmTzV1ZFI4eURVNkdYYmZoNWpieUhBMTR2cTE1ZlNLSFZqT1Q0OXZcbjk3M1ROb2hBRm1mUVhjU0c4YnBrVC9VclF2U2FYRlI2eGxNSVp1T0JTNHJsOG1XK0hkaGlBWlB1dE9TNU1TTWFcbkQzUElMbWpIdFY2V0p0cjZaNXNFVDg2Qy9kRVpYek5JcVRWaVFSY0IzVVZyenZkMWZFejE0cXFRRFcvcmIzU2pcbmNJOHl3RVFDcXBBeDN3MHduV21ZcVQzVHlqb21ybWpCS1Jaa05wMy9SVTBxUWxSQ1hFVjROdDg4MEtPZ3R3RHJcblBnMllzQi9aVnFJaE1nL0h4MjFIVTBZc21EYnpQWEEydVk4ZDhFaDY5UUtCZ1FENFFPamFMWlVkbnkvM0ltUG1cbjNVWkp5d0JYbUdJeHZEL25MSlpaWWwzUnp2aUh1bis4bmxuejNCSDRZdzdQZ1MxSDduSnFtMWN5d2VtbGQwZTFcbkRsK092WWdGODdqSVRoZU9reUZteXBHZDdNRXE2M3I4ZGhwb1ZyMnMxQXpHYllta05NWEc3L2VOYXlxSlBOb3Jcbkg1MHVwYmEzUlUwRHJ0N3Q1OUREaWNtbWt3S0JnUURwQ2lxTTZBckhjWGNRSGNqTTQ3VmZJNXFPWDFKMkdKekNcbkl5MjZrRmFib1ZoNFZzRmJmWTVxYlVYVElpb2JtUUpSOEZxVklyR2E4bTFrdWRteGJTemltMUlUQnNtR2h6aWVcbno3SXNOUWs0MW9FczdaVGJaa0tPbUFVN3I2bWR5NWRwUWxnL0dYN2IxRWY5YlNOamFUcU1nM2VpYWlwNXhaaGtcblBQN1JlRFVoelFLQmdFVFp1N3JHNlpSTmtmLzRpYng5b2dEVlRFTC9BRHpLK080a2I0NWF1YXAydkhib1FvVU5cblplVThJNysvdVZ2VGQ3dDdaa0FxMVFRK3c0NGdoc0t3T2RCY3dGem1PMWxTVHpZN21BZnFKbmltTU95MlltV2lcblc3Q1VYZ2FReVBvL1p1MGp0YloyMXpGaGgycUlkZmwveXhnazNZZjJzR1ZWR243Z3pBVnZNWDRCQW9HQVFwdXhcblJjMGRKNXg2MTVScnpJUlpWdlFxUFA5cDVtOXFmdUxuTXlnR1dUMW91Qnl6NzU2WGtqdmhkVk9TallqU2JQRXlcbk11WlR0V0lOZW5qVWpDNFVZa0RhMksxYjlLTzV2MHJHTm5TQ1NraWxhMTRNNmhqMGRTVm1lWVRnQ2tZaTVPY2RcbnFndHpnd25OK2RXMEE3b1VEZzJWcUVxSUVYNDA3Skd5azlTeit4RUNnWUJSbUxBNlNaSDRPSnNGbXMwNXord1FcbmxPSy9Xdmo1cFBVNU4xbjdHeEhLZG10c1BtWk84ZE11TlJ1VzNGalMrSmhNN0IwdzQ3OTl0cHFCSUlWN1Brd2hcblVCWVNjbmJ3TUVPaDdxaGhqMWRKSWpxM21DNW8ram9Ed3JRajkrQ0VZMDJTTC9QaG5qK2VObHlUOG8xTDQreVpcbnFVcldWaGJuOFJyOWc1emdSWGhYdkE9PVxuLS0tLS1FTkQgUFJJVkFURSBLRVktLS0tLVxuIiwKICAiY2xpZW50X2VtYWlsIjogImZpcmViYXNlLWFkbWluc2RrLXB1dHByQG1sbXByb2plY3QtYTE3MjcuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLAogICJjbGllbnRfaWQiOiAiMTAwNDY2NTI2MDk0OTU4NzI1NzUwIiwKICAiYXV0aF91cmkiOiAiaHR0cHM6Ly9hY2NvdW50cy5nb29nbGUuY29tL28vb2F1dGgyL2F1dGgiLAogICJ0b2tlbl91cmkiOiAiaHR0cHM6Ly9vYXV0aDIuZ29vZ2xlYXBpcy5jb20vdG9rZW4iLAogICJhdXRoX3Byb3ZpZGVyX3g1MDlfY2VydF91cmwiOiAiaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vb2F1dGgyL3YxL2NlcnRzIiwKICAiY2xpZW50X3g1MDlfY2VydF91cmwiOiAiaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vcm9ib3QvdjEvbWV0YWRhdGEveDUwOS9maXJlYmFzZS1hZG1pbnNkay1wdXRwciU0MG1sbXByb2plY3QtYTE3MjcuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLAogICJ1bml2ZXJzZV9kb21haW4iOiAiZ29vZ2xlYXBpcy5jb20iCn0K";

const serviceAccount = JSON.parse(
  Buffer.from(base64ServiceAccount, "base64").toString("utf-8")
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mlmproject-a1727.firebaseio.com", // Replace with your Firebase database URL
});
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

app.post("/create_account", async (req, res) => {
  const {
    email,
    username,
    password,
    phonenumber,
    role,
    useradded, // Expecting a boolean value
    parentuser, // This should be the document ID of the parent user
    noofpeopleadded,
    parentuser2
  } = req.body;

  if (
    !email ||
    !username ||
    !password ||
    !phonenumber ||
    !role ||
    useradded === undefined || // Check for boolean explicitly
    !parentuser ||
    !noofpeopleadded||
    !parentuser2
  ) {
    return res
      .status(400)
      .send({
        error:
          "email, username, password, phonenumber, role, useradded, parentuser, and noofpeopleadded are required",
      });
  }

  try {
    // Create a new user in Firebase Authentication
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: username,
    });

    // Update user document in Firestore
    const userDoc = {
      display_name: username,
      email: email,
      created_time: admin.firestore.FieldValue.serverTimestamp(),
      noofpeopleadded: noofpeopleadded,
      phone_number: phonenumber,
      useradded: useradded, // Store as boolean
      parentuser: admin.firestore().doc(`user/${parentuser}`), // Reference to the parent user document
      role: role,
      parentuser2:admin.firestore().doc(`user/${parentuser2}`),
    };

    await admin
      .firestore()
      .collection("user") // Ensure this matches your Firestore collection
      .doc(userRecord.uid)
      .set(userDoc);

    // Send welcome email
    const htmlContent = createUserEmail(username, email, password);
    await transporter.sendMail({
      from: "saiwealthadmin@saiwealth.co.in",
      to: email,
      subject: "Login credentials",
      html: htmlContent,
    });

    res.status(201).send({ message: "Account created successfully" });
  } catch (error) {
    console.error("Error creating account:", error);
    res.status(500).send({ error: "Failed to create account" });
  }
});

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
