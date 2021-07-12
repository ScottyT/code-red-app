const nodemailer = require('nodemailer');

const sendMail = async (toEmail, subject, attachment) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
            clientId: process.env.OAUTH_CLIENT_ID,
            clientSecret: process.env.OAUTH_CLIENT_SECRET,
            refreshToken: process.env.OAUTH_REFRESH_TOKEN,
            accessToken: process.env.OAUTH_ACCESS_TOKEN,
            expires: 1484314697598
        }
    })
    let mailOptions = {
        from: process.env.MAIL_USERNAME,
        to: toEmail,
        subject: subject,
        text: 'Hello! This email contains the contract you signed for Code Red.',
        attachments: [attachment]
    };
    
    return transporter.sendMail(mailOptions).then((data) => {
        return Promise.resolve("Email sent successfully!")
    }).catch((err) => {
        return Promise.reject(`Error ${err}`)
    })
}

module.exports = { sendMail }