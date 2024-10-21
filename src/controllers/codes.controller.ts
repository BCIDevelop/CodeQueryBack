import axios, { Axios } from "axios";
import { Request, Response } from "express";
import { version } from "os";
import { CodesNotFound } from "../exceptions/codes.exceptions";

class CodeController{
    private axiosClient:Axios
    private limitCredit:number
    private allowedLanguages: string[]
    constructor(){
       this.axiosClient = axios.create({
        baseURL: 'https://api.jdoodle.com/v1',
        headers: {
            'Content-Type': 'application/json'
          }
       })
       this.limitCredit = 20
       this.allowedLanguages = ['python','typescript','php','sql','java']
    }

    async getExecutedCode(req:Request,res:Response){
        try {
            let {code,language} = req.body
            if(!this.allowedLanguages.includes(language)) throw new CodesNotFound()

            const responseCredits=await this.axiosClient.post('/credit-spent',{
                clientId:process.env.JDOODLE_APP_ID,
                clientSecret:process.env.JDOODLE_APP_SECRET
            })
            if(responseCredits.data.used === this.limitCredit) return res.status(204).json()
            if(language === 'python') language = 'python3'
            const response=await this.axiosClient.post('/execute',{
                script: code,
                language:language,
                versionIndex: "0",
                clientId:process.env.JDOODLE_APP_ID,
                clientSecret:process.env.JDOODLE_APP_SECRET
            })
            return res.status(200).json(response.data)
        } catch (error:any) {
            console.log(error)
            return res.status(500).json({message:error.message})
        }
    }   

}
export default CodeController