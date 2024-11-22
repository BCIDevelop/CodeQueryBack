import { Router,Request,Response } from "express";
import TagController from "../controllers/tags.controller";
import Validation from "../validations/tags.validation";
import { isAuthenticated } from "../middlewares/auth.middlewares";
class TagRouter{
    private router: Router
    constructor(){
        this.router=Router()
    }
    init(){
        this.router.use(isAuthenticated)
        return this.router
        .get("/",Validation.listRecords(),this.all)
        .get('/:id',this.getById)
        .post('/',Validation.createRecord(),this.create)
    }

    async all(req:Request,res:Response){
        const controller=new TagController()
        await controller.listRecords(req,res)
    }
    async getById(req:Request,res:Response){
        const controller=new TagController()
        await controller.getRecordById(req,res)
    }
    async create(req:Request,res:Response){
        const controller=new TagController()
        await controller.createRecord(req,res)
    }
}
export default new TagRouter()