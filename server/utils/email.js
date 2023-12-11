const nodemailer = require('nodemailer');

async function email(html, subject, to) {
    console.log("Email: ", html, subject, to);
        let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'cricketlovesh@gmail.com',
        pass: process.env.PASSWORD
    }
    });
        let mailOptions = {
        from: 'cricketlovesh@gmail.com',
        to: to,
        subject: subject,
        html: html
        };
    
    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            console.log('Error Occurs', err);
            return new Error(err);
        }
        else {
            console.log('Email sent!!!' + data.response);
        }
    }); 
}

module.exports = email;