require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const fs = require('fs');

// Middleware
app.use(express.json());
app.use(cors());

// Serve index.html with env vars injected
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'index.html');
    fs.readFile(indexPath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error loading page');
        }

        // Inject PayPal Client ID from .env
        // Default to 'sb' (sandbox) if not set
        const clientId = process.env.PAYPAL_CLIENT_ID || 'sb';
        const html = data.replace('client-id=sb', `client-id=${clientId}`);

        res.send(html);
    });
});

app.use(express.static(path.join(__dirname, '/'))); // Serve other static files (assets, etc.)

// Email Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Route: Send File
app.post('/send-file', async (req, res) => {
    const { email, orderId } = req.body;

    if (!email || !orderId) {
        return res.status(400).json({ success: false, message: 'Missing email or Order ID' });
    }

    console.log(`Processing order ${orderId} for ${email}`);

    // Construct the download link (Assuming local or deployed URL)
    // In production, change 'localhost:3000' to your domain
    const protocol = req.protocol;
    const host = req.get('host');
    const downloadLink = `${protocol}://${host}/assets/secret-content.txt`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your file is unlocked 🔓',
        html: `
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #4facfe;">Payment Successful!</h2>
                <p>Thank you for your purchase. Your digital file is now available.</p>
                <div style="margin: 20px 0;">
                    <p><strong>Order ID:</strong> ${orderId}</p>
                </div>
                <a href="${downloadLink}" style="display: inline-block; background-color: #4facfe; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Download File</a>
                <p style="margin-top: 20px; font-size: 0.9em; color: #666;">If the button doesn't work, copy this link:<br> <a href="${downloadLink}">${downloadLink}</a></p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        res.json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send email' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
