import { Router,Request,Response } from "express";
import RoleController from "../controllers/roles.controller";
import Validation from "../validations/roles.validations";
import { isAuthenticated } from "../middlewares/auth.middlewares";
class RoleRouter{
    private router: Router
    constructor(){
        this.router=Router()
    }
    init(){
        this.router.use(isAuthenticated)
        return this.router
        .get("/",this.all)
        .post("/",Validation.createRecord(),this.create)
        .get('/:id',this.getById)
        .patch('/:id',Validation.updateRecord(),this.updateById)
        .delete('/:id',this.deleteById)
    }
    //listado
    async all(req:Request,res:Response){
        const controller=new RoleController()
        await controller.listRecords(req,res)
    }
    async create(req:Request,res:Response){
        const controller=new RoleController()
        await controller.createRecord(req,res)

    }
    async getById(req:Request,res:Response){
        const controller=new RoleController()
        await controller.getRecordById(req,res)
    }
    async updateById(req:Request,res:Response){
        const controller=new RoleController()
        await controller.updateRecordById(req,res)
    }
    async deleteById(req:Request,res:Response){
        const controller=new RoleController()
        await controller.deleteRecordById(req,res)
    }
}

export default new RoleRouter()