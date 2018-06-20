const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'elpis.soporte@gmail.com',
        pass: 'elpiselpis'
    }
});


function sendEmail(toUser,subject,text) {
    let mailOptions = {
        from: 'elpis.soporte@gmail.com',
        to: toUser,
        subject: subject,
        text: text
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}


module.exports = {
    sendEmail: sendEmail
};