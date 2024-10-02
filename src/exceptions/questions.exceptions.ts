export class QuestionNotFound{
    public message:string
    public code:number
    constructor(){
        this.message='Question Not Found'
        this.code=404
    }
}