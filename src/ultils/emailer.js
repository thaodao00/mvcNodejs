const nodemailer = require('nodemailer');
const queue = require('fastq').promise(worker, 1);
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'thaidinh62001@gmail.com',
        pass: 'ltnjqsegsmyarmhc'
    }
});

async function worker(data) {
    try {
        // await transporter.sendMail({

        // })

        data(null)
    }

    catch (err) {
        console.log(err);
        data(err)
    }
}
const sendMailQueue = async (subject, content, to) => {
    await transporter.sendMail({
        from: 'thaidinh62001@gmail.com',
        to: to,
        subject: subject,
        html: content,
    })
}
const sendEditRequestEmail = async (toEmail, noteTitle, noteContent) => {
        const mailOptions = {
            from: 'thaidinh62001@gmail.com',
            to: toEmail,
            subject: 'My Note: ' + noteTitle,
            text: 'Note Content: ' + noteContent
        };

        queue.push(sendMailQueue(mailOptions.subject, mailOptions.text, mailOptions.to), (err, result) => {
            if (err) throw err;
        })
};


module.exports = { sendEditRequestEmail };