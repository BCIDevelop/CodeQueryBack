export class AuthorizationNotFound{
    public message:string
    public code:number
    constructor(){
        this.message='Header Authorzation not found'
        this.code=401
    }
}