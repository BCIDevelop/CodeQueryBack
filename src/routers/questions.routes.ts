
import {Router,Response,Request} from 'express'
import Validation from "../validations/questions.validations";
import QuestionController from '../controllers/questions.controller';
import { isAuthenticated } from '../middlewares/auth.middlewares';

class QuestionRouter{
    private router:Router
    constructor(){
        this.router=Router()
    }
    init(){
        this.router.use(isAuthenticated)
        return this.router
        .get('/classroom/:id',Validation.listRecords(),this.all)
        .get('/me/:id',Validation.listRecords(),this.allMine)  
        .post('/',Validation.createRecord(),this.create)
        .get('/:id',this.getById)
        .patch('/:id',Validation.updateRecord(),this.updateById)
        .delete('/:id',this.deleteById)
    }

    async allMine(req:Request,res:Response){
        
        const controllers=new QuestionController()
        controllers.listMyRecords(req,res)
    }
    async all(req:Request,res:Response){
        
        const controllers=new QuestionController()
        controllers.listRecords(req,res)
    }
    async create(req:Request,res:Response){
        const controllers=new QuestionController()
         controllers.createRecords(req,res)
    }
    async getById(req:Request,res:Response){
        const controllers=new QuestionController()
         controllers.getRecordById(req,res)
    }
    async updateById(req:Request,res:Response){
        const controllers=new QuestionController()
         controllers.updateRecordById(req,res)
    }
    async deleteById(req:Request,res:Response){
        const controllers=new QuestionController()
         controllers.deleteRecordById(req,res)
    }
}
export default new QuestionRouter()