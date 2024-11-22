import { Request, Response } from 'express'
import models from '../models'
import { paginationField, paginatioResults } from '../helpers/pagination'
import axios, { Axios } from 'axios'
import { SubscriptionNotFound, SubscriptionProductFound } from '../exceptions/subscriptions.exceptions'
class SubscriptionController{
    private model:any
    private axiosClient: Axios
    constructor(){
        this.model = models.subscriptions
        this.axiosClient = axios.create({
            baseURL: 'https://api.stripe.com/v1',
            headers: {
                'Content-Type': 'application/json'
              }
           })
    }
    async getRecords(req:Request,res:Response){
        try {
            const { page, per_page } = req.query
            const { limit, offset } = paginationField(Number(page), Number(per_page))
            const records = await this.model.findAndCountAll({
                limit,
                offset,
                attributes: {
                    exclude: ['id'],
                },
            })
            const updatedRecords = await Promise.all(records.rows.map(async (element: any) => {
                const record = element.toJSON()
                const price = await this.axiosClient.get(`/prices/${element.price_id}`, {
                    headers: {
                        Authorization: `Basic ${btoa(process.env.STRIPE_APP_SECRET as string)}`
                    },
                })
                const { price_id,product_id, ...rest } = record
                rest.price = price.data.unit_amount / 100
                return rest
            }))
            records.rows = updatedRecords
            
            return res.status(200).json(paginatioResults(records,Number(page),Number(per_page)))
        } catch (error:any) {
            return res.status(error?.code|| 500).json({message:error.message})
        }
        
    }
    async createRecord(req:Request,res:Response){
        try {
            const {product_id} = req.body
            const product  = await this.axiosClient.get(`/products/${product_id}`,{
                headers:{
                    Authorization: `Basic ${btoa(process.env.STRIPE_APP_SECRET as string)}`
                }
            })
            if(!product.data) throw new SubscriptionNotFound()
            const subscriptionRecord =await this.model.findOne({
                where:{
                    product_id
                }
            })
            if(subscriptionRecord) throw new SubscriptionProductFound()
            
            const record = await this.model.create({product_id,name:product.data.name,price_id:product.data.default_price})
            return res.status(201).json({record})
            
        } catch (error:any) {
            if(error.response) return res.status(error.response.status).json({message:error.response.statusText})
            return res.status(500).json({message:error.message})
        }
    }

}
export default SubscriptionController