export class SubscriptionNotFound{
    public message:string
    public code:number
    constructor(){
        this.message='Subscription Not Found, Please create product in your dashboard'
        this.code=404
    }
}
export class SubscriptionProductFound{
    public message:string
    public code:number
    constructor(){
        this.message='Subscription already exist'
        this.code=404
    }
}
export class SubscriptionActive{
    public message:string
    public code:number
    constructor(){
        this.message='Already hava a Subscription with your account'
        this.code=400
    }
}
