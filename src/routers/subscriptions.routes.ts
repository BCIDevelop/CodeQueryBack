import { Router,Request,Response } from "express"
import SubscriptionController from "../controllers/subscriptions.controller"
import { isAuthenticated } from "../middlewares/auth.middlewares"
import Validation from "../validations/subscriptions.validations"

class SubscriptionRouter{
    private router: Router
    constructor(){
        this.router = Router()
    }
    init(){
        this.router.use(isAuthenticated)
        return this.router
        .get('/',Validation.listRecords(),this.listRecords)
        .post('/',Validation.createRecord(),this.createRecord)
    }

    async listRecords(req:Request,res:Response){
        const controller =  new SubscriptionController()
        await controller.getRecords(req,res)
    }
    async createRecord(req:Request,res:Response){
        const controller =  new SubscriptionController()
        await controller.createRecord(req,res)
    }

}
export default new SubscriptionRouter()