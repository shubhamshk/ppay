# Simple Digital Product Payment & Delivery

A minimal, secure, and beautiful website to sell digital files via PayPal and deliver them via email.

## 🚀 Setup

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Environment Variables**
    - Copy `.env.example` to `.env`:
        ```bash
        cp .env.example .env
        ```
        *(Or just create a new file named `.env`)*
    - Open `.env` and fill in your details:
        - `EMAIL_USER`: Your Gmail address.
        - `EMAIL_PASS`: **IMPORTANT**: This is NOT your login password. You must generate an **App Password**.
          - Go to [Google Account > Security](https://myaccount.google.com/security).
          - Enable 2-Step Verification.
          - Search for "App passwords".
          - Create one named "Payment Site" and paste the 16-character code into `.env`.

3.  **PayPal Configuration**
    - Open `index.html`.
    - Scroll to the bottom and find the PayPal script tag:
      ```html
      <script src="https://www.paypal.com/sdk/js?client-id=sb&currency=USD"></script>
      ```
    - Replace `sb` with your actual **PayPal Client ID** from the [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/).
    - *Note: `sb` stands for Sandbox. It will works for testing if you have a sandbox account logged in.*

4.  **Add Your Locked File**
    - Place your digital product in the `assets` folder.
    - Rename it to `secret-content.txt` OR update line 41 in `server.js` to match your filename.

## 🏃‍♂️ Run Locally

Start the server:
```bash
node server.js
```
Visit `http://localhost:3000` to see your payment page.

## ✨ Features
- **Glassmorphism UI**: Modern and clean design.
- **Secure Delivery**: File is sent via email backend, not exposed in frontend code.
- **PayPal Integration**: Client-side Smart Payment Buttons.
- **Validation**: Ensures email is entered before payment.
