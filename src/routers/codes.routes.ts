
import {Router,Response,Request} from 'express'
import Validation from "../validations/codes.validations";
import CodeController from '../controllers/codes.controller';
import { isAuthenticated } from '../middlewares/auth.middlewares';

class CodeRouter{
    private router:Router
    constructor(){
        this.router=Router()
    }
   
    init(){
        this.router.use(isAuthenticated)
        return this.router
        .post('/execute',Validation.executeCode(),this.listCodeExecuted)
        
      
    }
    async listCodeExecuted(req:Request,res:Response){
        const controllers=new CodeController()
        controllers.getExecutedCode(req,res)
    }
 
}
export default new CodeRouter()