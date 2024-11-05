import { Request,Response } from 'express'
import models from '../models'
import { AuthenticatedRequest } from '../types/request.type'
import { UserNotFound } from '../exceptions/users.exceptions'
import { SubscriptionActive, SubscriptionNotFound } from '../exceptions/subscriptions.exceptions'
import {Stripe} from 'stripe'
import axios, { Axios } from 'axios'
import bodyParser from 'body-parser'
import { where } from 'sequelize'
class PaymentController{
    private userModel : any
    private subscriptionModel : any
    private axiosClient:Axios
    private stripe:Stripe
    constructor(){
        this.userModel = models.users
        this.subscriptionModel = models.subscriptions
        this.axiosClient = axios.create({
            baseURL: 'https://api.stripe.com/v1',
            headers: {
                'Content-Type': 'application/json'
              }
           })
        this.stripe = new Stripe(process.env.STRIPE_APP_SECRET as string)
    }

    async getCheckOut(req:AuthenticatedRequest,res:Response){
        try {
            const {name} = req.body
            const userId = req.current_user
            console.log(userId)
            const userRecord = await this.userModel.findOne({
                where:{
                    id:userId
                },
                attributes:['id','subscription_id','customer_id','email','name','last_name']
            })
            
            if(!userRecord) throw new UserNotFound()
            if(userRecord.subscription_id) throw new SubscriptionActive()
                    console.log('paseeeeeeeeeeeeeee')
            const subscriptionRecord = await this.subscriptionModel.findOne({
                where:{
                    name
                },
                attributes:["price_id"]
            })

            if(!subscriptionRecord) throw new SubscriptionNotFound()
            if(!userRecord.customer_id){
                const responseCustomer = await this.axiosClient.post('/customers',{
                    name:`${userRecord.name} ${userRecord.last_name}`,
                    email:userRecord.email
                },{
                    headers:{
                        Authorization: `Basic ${btoa(process.env.STRIPE_APP_SECRET as string)}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                })
                userRecord.customer_id = responseCustomer.data.id
                await userRecord.save()
               
            }
            const params = new URLSearchParams()
            params.append('line_items[0][price]', subscriptionRecord.price_id)
            params.append('line_items[0][quantity]', '1')
            params.append('mode', 'subscription')
            params.append('success_url', `${process.env.CLIENT_URL}/success`)
            params.append('customer', userRecord.customer_id)
            const responseSession = await this.axiosClient.post('/checkout/sessions',params,{
                headers:{
                    Authorization: `Basic ${btoa(process.env.STRIPE_APP_SECRET as string)}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            })
            
            return res.status(201).json({url:responseSession.data.url})
        
        } catch (error:any) {
            if(error.response) return res.status(error.response.status).json({message:error.response.statusText})
            return res.status(error?.code|| 500).json({message:error.message})
        }   
        

    }
    async getWebhook(req:Request,res:Response){
        let event = req.body;
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET
        if (endpointSecret) {
            // Get the signature sent by Stripe
            const signature = req.headers['stripe-signature'];
            try {
              event = this.stripe.webhooks.constructEvent(
                req.body,
                signature!,
                endpointSecret
              );
            } catch (err:any) {
              console.log(`⚠️  Webhook signature verification failed.`, err.message);
              return res.sendStatus(400);
            }
          }
          switch (event.type) {
            case 'customer.subscription.created':
              const customerSubscription = event.data.object;
              const {customer,id,plan} = customerSubscription
              const {product} = plan
              const userRecord = await this.userModel.findOne({
                where:{
                    customer_id:customer
                }
              })
              if(!userRecord) return res.sendStatus(400)
              const subscriptionRecord =await this.subscriptionModel.findOne({
                  where:{product_id:product}
              })  

              if(!subscriptionRecord) return res.sendStatus(400)
              userRecord.subscription_id = subscriptionRecord.id
              userRecord.subscription_user = id
              userRecord.save()
              break;
            case 'customer.subscription.deleted':
                const customerSubscriptionDeleted = event.data.object;
                const {customerDeleted} = customerSubscriptionDeleted
                const userRecordDeleted = await this.userModel.findOne({
                    where:{
                        customer_id:customerDeleted
                    }
                })
                if(!userRecordDeleted) return res.sendStatus(400)
                userRecordDeleted.subscription_user = null
                userRecordDeleted.subscription_id = null
                userRecordDeleted.save()
                break
            case 'customer.subscription.updated':
                const customerSubscriptionUpdated = event.data.object;
                const {cancel_at_period_end,cancellation_details,customer : customerUpdated,plan:subscriptionPlan,id:subscription_id} = customerSubscriptionUpdated
                if (!cancellation_details.feedback){
                    const userRecord = await this.userModel.findOne({
                        where:{
                            customer_id:customerUpdated
                        }
                    })
                    if(!userRecord) return res.sendStatus(400)
                    if(cancel_at_period_end){
                        userRecord.subscription_user=null
                        userRecord.subscription_id = null
                    }
                    else{
                        const subscription_record = await this.subscriptionModel.findOne({
                            where:{product_id:subscriptionPlan.product},
                            attributes:['id'],
                            raw: true
                        })
                        if(!subscription_record) return res.sendStatus(400)
                        userRecord.subscription_user=subscription_id
                        userRecord.subscription_id = subscription_record.id
                    }
                    userRecord.save()
                }
                break
                
            default:
              // Unexpected event type
              console.log(`Unhandled event type ${event.type}.`);
          }
        
          // Return a 200 response to acknowledge receipt of the event
          res.send();
        
        
    }

    async getCustomerPortal(req:AuthenticatedRequest,res:Response){
        try {
            const userId = req.current_user
            const record = await this.userModel.findOne({
                where:{
                    id:userId
                },
                attributes:["customer_id"]
            })
            if(!record) throw new UserNotFound()
            const session = await this.stripe.billingPortal.sessions.create({
                customer: record.customer_id,
                return_url:`${process.env.CLIENT_URL}/dashboard`
            })
            return res.status(200).json({results:{url:session.url}})
        } catch (error:any) {
            return res.status(error?.code|| 500).json({message:error.message})
        }
        
    }


}
export default PaymentController