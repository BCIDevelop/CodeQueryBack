import UserController from '../controllers/users.controller'
import {Router,Response,Request} from 'express'
import Validation from "../validations/users.validations";
/* import Validation from '../validations/users.validations' */
class UserRouter{
    private router:Router
    constructor(){
        this.router=Router()
    }
    init(){
        return this.router
        .get('/',Validation.listRecords(),this.all)
        .post('/',Validation.createRecord(),this.create)
        .get('/:id',this.getById)
        .patch('/:id',this.updateById)
        .delete('/:id',this.deleteById)
    }
    async all(req:Request,res:Response){
        console.log('entre')
           const controllers=new UserController()
            controllers.listRecords(req,res)
    }
    async create(req:Request,res:Response){
        const controllers=new UserController()
         controllers.createRecords(req,res)
    }
    async getById(req:Request,res:Response){
        const controllers=new UserController()
         controllers.getRecordById(req,res)
    }
    async updateById(req:Request,res:Response){
        const controllers=new UserController()
         controllers.updateRecordById(req,res)
    }
    async deleteById(req:Request,res:Response){
        const controllers=new UserController()
         controllers.deleteRecordById(req,res)
    }
}
export default new UserRouter()