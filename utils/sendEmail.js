import nodemailer from 'nodemailer'

export const sendEmail = async (o) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const emailOptions = {
        from: "Meow...Meow INC <carmacabo@gmail.com>",
        to: o.email,
        subject: o.subject,
        text: o.message
    }

    await transporter.sendMail(emailOptions)
}

