export class RoleNotFound{
    public message:string
    public code:number
    constructor(){
        this.message='Role Not Found'
        this.code=404
    }
}