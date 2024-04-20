import nodemailer, {TransportOptions} from "nodemailer";
import generalConfig from "../config/general.config";



export default class Mailer {
    public readonly transporter: any|null = null;
    public constructor(){
        this.transporter = nodemailer.createTransport({
            host: generalConfig.SMTP_HOST,
            port: generalConfig.SMTP_PORT,
            secure: false,
            auth: {
                user: generalConfig.SMTP_USER,
                pass: generalConfig.SMTP_PASS
            }
        } as TransportOptions)
    }


    public async send(to: string, subject: string, body: string){
        const info = await this.transporter!.sendMail({
            from: generalConfig.SMTP_USER,
            to,
            subject,
            html: body
        })
        return info;
    }
}