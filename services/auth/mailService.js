const mailer = require('nodemailer')

const mailService = {
    async sendActivationMail(to,link){
        await this.transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: 'Активация аккаунта на ' + process.env.API_URL,
            text: '',
            html:
                `
                    <div>
                        <h1>To activate your account press the link:</h1>
                        <a href="${link}">${link}</a>
                    </div>
                `
        })
    },
    transporter: mailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        }
    })
}

module.exports = mailService
