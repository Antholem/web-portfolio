const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.REACT_APP_PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'https://sam-manalo.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Email endpoint
app.post('/', (req, res) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.REACT_APP_FROM_EMAIL,
      pass: process.env.REACT_APP_FROM_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.FROM_EMAIL,
    to: process.env.REACT_APP_TO_EMAIL,
    subject: req.body.subject,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; margin: 20px auto; border: 1px solid #ddd; border-radius: 8px; padding: 15px; width: 100%; box-sizing: border-box;">
        <div style="display: flex; align-items: flex-start; gap: 10px; flex-wrap: wrap;">
          <img
            src="${req.body.photo}"
            alt="${req.body.email}"
            style="width: 50px; height: 50px; border-radius: 50%; flex-shrink: 0;"
          />
          <div style="flex: 1; min-width: 200px;">
              <p style="margin: 0; font-weight: bold; word-break: break-word;">
                &nbsp;
                ${req.body.name}
              </p>
              <p style="margin: 0; font-size: 0.9em; color: #555; word-break: break-word;">
                &nbsp;
                ${req.body.email}
              </p>
          </div>
        </div>
        <div style="border-top: 1px solid #ddd; padding-top: 10px; margin-top: 10px;">
          <p style="margin: 0; font-size: 1em; color: #333; word-break: break-word;">
            ${req.body.message}
          </p>
        </div>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error:', error);
      res.status(500).send('Error sending email');
    } else {
      console.log('Email sent:', info.response);
      res.status(200).send('Email sent successfully');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
