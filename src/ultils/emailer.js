const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'thaidinh62001@gmail.com',
        pass: 'ltnjqsegsmyarmhc'
    }
});
const sendEditRequestEmail = (toEmail, noteTitle, noteContent) => {
    return new Promise((resolve, reject) => {
        const mailOptions = {
            from: 'thaidinh62001@gmail.com',
            to: toEmail,
            subject: 'My Note: ' + noteTitle,
            text: 'Note Content: ' + noteContent
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending email:', error);
                reject(error); // Trả về lỗi nếu có lỗi
            } else {
                console.log('Email sent:', info.response);
                resolve(info.response); // Trả về kết quả thành công
            }
        });
    });
};


module.exports = { sendEditRequestEmail };