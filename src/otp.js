

"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function sendOTP(email, otp) {

        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing
        let testAccount = await nodemailer.createTestAccount();

        // create reusable transporter object using the default SMTP transport
        const transporter = nodemailer.createTransport({
            host:  process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: `"Cybercyld-A Digital Security Plateform" <${process.env.MAIL_USER}>`, // sender address
            to:`${email}`, // list of receivers
            subject: "One time Password-no-reply", // Subject line
            html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;;text-decoration:none;font-weight:600"> <img src="https://www.cybercyld.com/public/CyberCyld-logo.png" style="height:100px; width:100%; "/> </a>
    </div>
    <p style="font-size:1.1em">Hi,</p>
    <p>Thank you for choosing CyberCyld__A Digital Security Plateform. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
    <p style="font-size:0.9em;">Regards,<br />CyberCyld<small>by-Apptwig</small></p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p style="color:yellow;">CyberCyld</p>
      <p>Madhuban Vihar Coloney Near PGI Lucknow (226014)</p>
      <p>Utter Pardesh (India)</p>
    </div>
  </div>
</div>`, // html body
        });

        // console.log("Message sent: %s", info.messageId);
                  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

                  // Preview only available when sending through an Ethereal account
        // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
                  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
  

}


module.exports = sendOTP;