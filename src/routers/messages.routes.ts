
import {Router,Response,Request} from 'express'
import Validation from "../validations/messages.validations";
import MessageController from '../controllers/messages.controller';
import { isAuthenticated } from '../middlewares/auth.middlewares';

class MessageRouter{
    private router:Router
    constructor(){
        this.router=Router()
    }
    init(){
        this.router.use(isAuthenticated)
        return this.router
      
        .get('/chat/:id',Validation.listRecords(),this.allByChat)
        .post('/chat',Validation.createRecords(),this.createByChat)
        .delete('/:id', this.delete)
      
    }

    
    async allByChat(req:Request,res:Response){
        const controllers=new MessageController()
         controllers.listRecords(req,res)
    }
    async createByChat(req:Request,res:Response){
        const controllers=new MessageController()
        controllers.createRecords(req,res)
    }
    async delete(req:Request,res:Response){
        const controllers=new MessageController()
        controllers.deleteRecordById(req,res)
    }
  
}
export default new MessageRouter()