export class ChatFound{
    public message:string
    public code:number
    constructor(){
        this.message='Chat already exists'
        this.code=400
    }
}
export class ChatNotFound{
    public message:string
    public code:number
    constructor(){
        this.message='Chat doesnt exist'
        this.code=404
    }
}