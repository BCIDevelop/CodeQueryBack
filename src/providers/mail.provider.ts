import {createTransport, Transporter} from "nodemailer"
import SMTPTransport from "nodemailer/lib/smtp-transport"
import { ConnectionOptions } from "sequelize"
class EmailServer{
    private host:string|undefined
    private port:number|undefined
    private username:string|undefined
    private password:string|undefined
    private tls:ConnectionOptions|undefined
    private client: Transporter
    constructor(){
        this.host = process.env.MAIL_SERVER || ""
        this.port = Number(process.env.MAIL_PORT) || 587
        this.username = process.env.MAIL_USERNAME || ""
        this.password = process.env.MAIL_PASSWORD || ""
       
        const smtpConfig: SMTPTransport.Options ={

            host:this.host,
            port:this.port,
            auth:{
                user:this.username,
                pass:this.password
            }
        }
        this.client=createTransport(smtpConfig )
    }
    async send(to:string,subject:string,html:string){
        return this.client.sendMail({
            from:this.username,
            to,
            subject,
            html
        })
    }
    async resetPassword(email:string,password:string){
        try{
            const mailer=await this.send(email,'New Password',`Your new Password is : <b>${password} </b>`)
        }
        catch(error){

        }
    }
}
export default new EmailServer()