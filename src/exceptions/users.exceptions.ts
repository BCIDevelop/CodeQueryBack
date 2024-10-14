export class UserNotFound{
    public message:string
    public code:number
    constructor(){
        this.message='User Not Found'
        this.code=404
    }
}
export class UserInactive{
    public message:string
    public code:number
    constructor(){
        this.message='User Inactive'
        this.code=401
    }
}
export class UserActive{
    public message:string
    public code:number
    constructor(){
        this.message='User already active'
        this.code=401
    }
}
export class UserBadToken{
    public message:string
    public code:number
    constructor(){
        this.message='Token doesnt match'
        this.code=401
    }
}
export class UserIncorretPassword{
    public message:string
    public code:number
    constructor(){
        this.message='Incorret password'
        this.code=401
    }
}
export class UserPasswordIncorrectSchema{
    public message:string
    public code:number
    constructor(message:string ='Incorret password'){
        this.message=message
        this.code=401
    }
}