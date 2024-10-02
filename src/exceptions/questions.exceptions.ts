export class QuestionNotFound{
    public message:string
    public code:number
    constructor(){
        this.message='Classroom Not Found'
        this.code=404
    }
}