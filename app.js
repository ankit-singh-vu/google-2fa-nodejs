const express = require('express');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

const app = express();

const secret = speakeasy.generateSecret();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get("/",(req,resp)=>{
     resp.send('QR code URL:');
})

app.get("/generate_QR",(req,resp)=>{
    qrcode.toDataURL(secret.otpauth_url, (err, imageUrl) => {
      if (err) {
        console.error('Error generating QR code:', err);
        return;
      }
     resp.send('QR code URL: '+imageUrl);
      // you can then display the QR by adding'<img src="' + imageUrl + '">';
    });
})

// Continue setting up your Express routes and other application logic


app.post('/verify', (req, res) => {
    const userToken = req.body.token; // OTP entered by the user
    const verified = speakeasy.totp.verify({
      secret: secret.base32,
      encoding: 'base32',
      token: userToken,
      window: 1, // Allow a time window of 1 unit (default is 0)
    });
  
    if (verified) {
      // Mark user as 2FA-enabled in your database
      res.send('OTP verified successfully. Two-factor authentication enabled!');
    } else {
      res.status(401).send('OTP verification failed. Please try again.');
    }
  });
  
  app.listen(3000)

  // Add more routes and finalize your application logic