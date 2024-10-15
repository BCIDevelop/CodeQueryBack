
import {Router,Response,Request} from 'express'
import Validation from "../validations/answers.validations";
import AnswerController from '../controllers/answers.controller';
import { isAuthenticated } from '../middlewares/auth.middlewares';

class AnswerRouter{
    private router:Router
    constructor(){
        this.router=Router()
    }
    init(){
        this.router.use(isAuthenticated)
        return this.router
        .get('/question/:question_id',Validation.listRecords(),this.all)
        .post('/',Validation.createRecord(),this.create)
        .get('/:id',this.getById)
        .patch('/:id',Validation.updateRecord(),this.updateById)
        .delete('/:id',this.deleteById)
        .get('/classroom/:classroom_id',Validation.listRecords(),this.allByClassroom)
    }
    async allByClassroom(req:Request,res:Response){
        
        const controllers=new AnswerController()
        controllers.listRecordsByClassrooms(req,res)
    }
    async all(req:Request,res:Response){
        
        const controllers=new AnswerController()
        controllers.listRecords(req,res)
    }
    async create(req:Request,res:Response){
        const controllers=new AnswerController()
         controllers.createRecords(req,res)
    }
    async getById(req:Request,res:Response){
        const controllers=new AnswerController()
         controllers.getRecordById(req,res)
    }
    async updateById(req:Request,res:Response){
        const controllers=new AnswerController()
         controllers.updateRecordById(req,res)
    }
    async deleteById(req:Request,res:Response){
        const controllers=new AnswerController()
         controllers.deleteRecordById(req,res)
    }
}
export default new AnswerRouter()