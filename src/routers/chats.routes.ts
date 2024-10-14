
import {Router,Response,Request} from 'express'
import Validation from "../validations/chats.validations";
import ChatController from '../controllers/chats.controller';
import { isAuthenticated } from '../middlewares/auth.middlewares';

class ChatRouter{
    private router:Router
    constructor(){
        this.router=Router()
    }
    init(){
        this.router.use(isAuthenticated)
        return this.router
      
        .get('/',Validation.listRecords(),this.all)
        .post('/',Validation.createRecords(),this.create)
        .delete('/receiver/:id', this.delete)
      
    }

    
    async all(req:Request,res:Response){
        const controllers=new ChatController()
         controllers.listRecords(req,res)
    }
    async create(req:Request,res:Response){
        const controllers=new ChatController()
        controllers.createRecords(req,res)
    }
    async delete(req:Request,res:Response){
        const controllers=new ChatController()
        controllers.deleteRecordById(req,res)
    }
  
}
export default new ChatRouter()