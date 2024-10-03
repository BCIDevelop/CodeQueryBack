export class AnswerNotFound{
    public message:string
    public code:number
    constructor(){
        this.message='Answer Not Found'
        this.code=404
    }
}