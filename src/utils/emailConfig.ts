import { createTransport } from 'nodemailer'
import { config } from 'dotenv'

config()
const { EMAIL, CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN } = process.env

const transporter = createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: EMAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN
    }
})

const sendMessage = async (to: string, text: string, subject: string) => {
    try {
        await transporter.sendMail({
            from: 'bswebstudios@gmail.com',
            to: to,
            subject: subject,
            text: text
        })

        return { status: 200, message: 'Correo enviado!' }
    } catch (error) {
        return { status: 500, message: 'Hubo un error con el servidor. Inténtalo más tarde.' }
    }
}

export default sendMessage