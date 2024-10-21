export class CodesNotFound{
    public message:string
    public code:number
    constructor(){
        this.message='Code Not Allowed'
        this.code=400
    }
}
export class CodesLimitReached{
    public message:string
    public code:number
    constructor(){
        this.message='Free Limit Use Spent'
        this.code=400
    }
}