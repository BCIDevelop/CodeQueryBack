
import {Router,Response,Request} from 'express'
import Validation from "../validations/classrooms.validations";
import ClassroomController from '../controllers/classrooms.controller';
import { isAuthenticated } from '../middlewares/auth.middlewares';

class ClassroomRouter{
    private router:Router
    constructor(){
        this.router=Router()
    }
   
    init(){
        this.router.use(isAuthenticated)
        return this.router
        .get('/admin',Validation.listRecords(),this.allAdmin)
        .get('/',Validation.listRecords(),this.all)  
        .post('/',Validation.createRecord(),this.create)
        .get('/:id',this.getById)
        .patch('/:id',Validation.updateRecord(),this.updateById)
        .delete('/:id',this.deleteById)
        //Students routes
        .get('/:id/students',Validation.listRecords(),this.allStudents)
        .post('/:id/students',Validation.addStudents(),this.addStudents)
        .post('/:id/students/bulk',Validation.addBulkStudents(),this.addBulkStudents)
        .delete('/:id/student/:user_id',this.deleteStudent)
        .patch('/student/confirm',Validation.confirmStudent(),this.confirmStudent)
      
    }
    async confirmStudent(req:Request,res:Response){
        const controllers=new ClassroomController()
        controllers.confirmStudentClassroom(req,res)
    }
    async deleteStudent(req:Request,res:Response){
        const controllers=new ClassroomController()
         controllers.deleteStudent(req,res)
    }
    async addBulkStudents(req:Request,res:Response){
        
        const controllers=new ClassroomController()
         controllers.createBulkStudents(req,res)
    }
    async addStudents(req:Request,res:Response){
        
        const controllers=new ClassroomController()
         controllers.createRecordsStudents(req,res)
    }
    async allStudents(req:Request,res:Response){
        
        const controllers=new ClassroomController()
         controllers.listRecordsStudents(req,res)
    }
    async allAdmin(req:Request,res:Response){
        
        const controllers=new ClassroomController()
         controllers.listRecordsAdmin(req,res)
 }
    async all(req:Request,res:Response){
        
           const controllers=new ClassroomController()
            controllers.listRecords(req,res)
    }
    async create(req:Request,res:Response){
        const controllers=new ClassroomController()
         controllers.createRecords(req,res)
    }
    async getById(req:Request,res:Response){
        const controllers=new ClassroomController()
         controllers.getRecordById(req,res)
    }
    async updateById(req:Request,res:Response){
        const controllers=new ClassroomController()
         controllers.updateRecordById(req,res)
    }
    async deleteById(req:Request,res:Response){
        const controllers=new ClassroomController()
         controllers.deleteRecordById(req,res)
    }
}
export default new ClassroomRouter()