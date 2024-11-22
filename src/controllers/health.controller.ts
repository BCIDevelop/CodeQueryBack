import { Request, Response } from "express";

class HealthController{

    check(req:Request,res:Response){
        return res.status(200).send()
    }
}
export default HealthController