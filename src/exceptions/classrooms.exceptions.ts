export class ClassroomNotFound{
    public message:string
    public code:number
    constructor(){
        this.message='Classroom Not Found'
        this.code=404
    }
}
export class StudentNotInClassroom{
    public message:string
    public code:number
    constructor(){
        this.message='Student Not in Classroom'
        this.code=404
    }
}