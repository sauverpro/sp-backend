import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
    service: process.env.MAILER_SERVICE,
    auth:{
        user: process.env.MAILER_AUTH_USER,
        pass: process.env.MAILER_AUTH_PASS
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
      },
})