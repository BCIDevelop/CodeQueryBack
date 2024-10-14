export class MessageNotFound{
    public message:string
    public code:number
    constructor(){
        this.message='Message Not Found'
        this.code=404
    }
}