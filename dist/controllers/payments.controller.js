"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = __importDefault(require("../models"));
const users_exceptions_1 = require("../exceptions/users.exceptions");
const subscriptions_exceptions_1 = require("../exceptions/subscriptions.exceptions");
const stripe_1 = require("stripe");
const axios_1 = __importDefault(require("axios"));
class PaymentController {
    constructor() {
        this.userModel = models_1.default.users;
        this.subscriptionModel = models_1.default.subscriptions;
        this.axiosClient = axios_1.default.create({
            baseURL: 'https://api.stripe.com/v1',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        this.stripe = new stripe_1.Stripe(process.env.STRIPE_APP_SECRET);
    }
    getCheckOut(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name } = req.body;
                const userId = req.current_user;
                const userRecord = yield this.userModel.findOne({
                    where: {
                        id: userId
                    },
                    attributes: ['id', 'subscription_id', 'customer_id', 'email', 'name', 'last_name']
                });
                if (!userRecord)
                    throw new users_exceptions_1.UserNotFound();
                if (userRecord.subscription_id)
                    throw new subscriptions_exceptions_1.SubscriptionActive();
                const subscriptionRecord = yield this.subscriptionModel.findOne({
                    where: {
                        name
                    },
                    attributes: ["price_id"]
                });
                if (!subscriptionRecord)
                    throw new subscriptions_exceptions_1.SubscriptionNotFound();
                if (!userRecord.customer_id) {
                    const responseCustomer = yield this.axiosClient.post('/customers', {
                        name: `${userRecord.name} ${userRecord.last_name}`,
                        email: userRecord.email
                    }, {
                        headers: {
                            Authorization: `Basic ${btoa(process.env.STRIPE_APP_SECRET)}`,
                            'Content-Type': 'application/x-www-form-urlencoded'
                        }
                    });
                    userRecord.customer_id = responseCustomer.data.id;
                    yield userRecord.save();
                }
                const params = new URLSearchParams();
                params.append('line_items[0][price]', subscriptionRecord.price_id);
                params.append('line_items[0][quantity]', '1');
                params.append('mode', 'subscription');
                params.append('success_url', `${process.env.CLIENT_URL}/success`);
                params.append('customer', userRecord.customer_id);
                const responseSession = yield this.axiosClient.post('/checkout/sessions', params, {
                    headers: {
                        Authorization: `Basic ${btoa(process.env.STRIPE_APP_SECRET)}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
                return res.status(201).json({ url: responseSession.data.url });
            }
            catch (error) {
                if (error.response)
                    return res.status(error.response.status).json({ message: error.response.statusText });
                return res.status((error === null || error === void 0 ? void 0 : error.code) || 500).json({ message: error.message });
            }
        });
    }
    getWebhook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let event = req.body;
            const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
            if (endpointSecret) {
                // Get the signature sent by Stripe
                const signature = req.headers['stripe-signature'];
                try {
                    event = this.stripe.webhooks.constructEvent(req.body, signature, endpointSecret);
                }
                catch (err) {
                    console.log(`⚠️  Webhook signature verification failed.`, err.message);
                    return res.sendStatus(400);
                }
            }
            switch (event.type) {
                case 'customer.subscription.created':
                    const customerSubscription = event.data.object;
                    const { customer, id, plan } = customerSubscription;
                    const { product } = plan;
                    const userRecord = yield this.userModel.findOne({
                        where: {
                            customer_id: customer
                        }
                    });
                    if (!userRecord)
                        return res.sendStatus(400);
                    const subscriptionRecord = yield this.subscriptionModel.findOne({
                        where: { product_id: product }
                    });
                    if (!subscriptionRecord)
                        return res.sendStatus(400);
                    userRecord.subscription_id = subscriptionRecord.id;
                    userRecord.subscription_user = id;
                    userRecord.save();
                    break;
                case 'customer.subscription.deleted':
                    const customerSubscriptionDeleted = event.data.object;
                    const { customerDeleted } = customerSubscriptionDeleted;
                    const userRecordDeleted = yield this.userModel.findOne({
                        where: {
                            customer_id: customerDeleted
                        }
                    });
                    if (!userRecordDeleted)
                        return res.sendStatus(400);
                    userRecordDeleted.subscription_user = null;
                    userRecordDeleted.subscription_id = null;
                    userRecordDeleted.save();
                    break;
                case 'customer.subscription.updated':
                    const customerSubscriptionUpdated = event.data.object;
                    const { cancel_at_period_end, cancellation_details, customer: customerUpdated, plan: subscriptionPlan, id: subscription_id } = customerSubscriptionUpdated;
                    if (!cancellation_details.feedback) {
                        const userRecord = yield this.userModel.findOne({
                            where: {
                                customer_id: customerUpdated
                            }
                        });
                        if (!userRecord)
                            return res.sendStatus(400);
                        if (cancel_at_period_end) {
                            userRecord.subscription_user = null;
                            userRecord.subscription_id = null;
                        }
                        else {
                            const subscription_record = yield this.subscriptionModel.findOne({
                                where: { product_id: subscriptionPlan.product },
                                attributes: ['id'],
                                raw: true
                            });
                            if (!subscription_record)
                                return res.sendStatus(400);
                            userRecord.subscription_user = subscription_id;
                            userRecord.subscription_id = subscription_record.id;
                        }
                        userRecord.save();
                    }
                    break;
                default:
                    // Unexpected event type
                    console.log(`Unhandled event type ${event.type}.`);
            }
            // Return a 200 response to acknowledge receipt of the event
            res.send();
        });
    }
    getCustomerPortal(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.current_user;
                const record = yield this.userModel.findOne({
                    where: {
                        id: userId
                    },
                    attributes: ["customer_id"]
                });
                if (!record)
                    throw new users_exceptions_1.UserNotFound();
                if (!record.customer_id)
                    throw new users_exceptions_1.UserNotFound();
                const session = yield this.stripe.billingPortal.sessions.create({
                    customer: record.customer_id,
                    return_url: `${process.env.CLIENT_URL}/dashboard`
                });
                return res.status(200).json({ results: { url: session.url } });
            }
            catch (error) {
                return res.status((error === null || error === void 0 ? void 0 : error.code) || 500).json({ message: error.message });
            }
        });
    }
}
exports.default = PaymentController;
