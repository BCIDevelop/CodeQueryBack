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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = __importDefault(require("../models"));
const pagination_1 = require("../helpers/pagination");
const axios_1 = __importDefault(require("axios"));
const subscriptions_exceptions_1 = require("../exceptions/subscriptions.exceptions");
class SubscriptionController {
    constructor() {
        this.model = models_1.default.subscriptions;
        this.axiosClient = axios_1.default.create({
            baseURL: 'https://api.stripe.com/v1',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
    getRecords(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, per_page } = req.query;
                const { limit, offset } = (0, pagination_1.paginationField)(Number(page), Number(per_page));
                const records = yield this.model.findAndCountAll({
                    limit,
                    offset,
                    attributes: {
                        exclude: ['id'],
                    },
                });
                const updatedRecords = yield Promise.all(records.rows.map((element) => __awaiter(this, void 0, void 0, function* () {
                    const record = element.toJSON();
                    const price = yield this.axiosClient.get(`/prices/${element.price_id}`, {
                        headers: {
                            Authorization: `Basic ${btoa(process.env.STRIPE_APP_SECRET)}`
                        },
                    });
                    const { price_id, product_id } = record, rest = __rest(record, ["price_id", "product_id"]);
                    rest.price = price.data.unit_amount / 100;
                    return rest;
                })));
                records.rows = updatedRecords;
                return res.status(200).json((0, pagination_1.paginatioResults)(records, Number(page), Number(per_page)));
            }
            catch (error) {
                return res.status((error === null || error === void 0 ? void 0 : error.code) || 500).json({ message: error.message });
            }
        });
    }
    createRecord(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { product_id } = req.body;
                const product = yield this.axiosClient.get(`/products/${product_id}`, {
                    headers: {
                        Authorization: `Basic ${btoa(process.env.STRIPE_APP_SECRET)}`
                    }
                });
                if (!product.data)
                    throw new subscriptions_exceptions_1.SubscriptionNotFound();
                const subscriptionRecord = yield this.model.findOne({
                    where: {
                        product_id
                    }
                });
                if (subscriptionRecord)
                    throw new subscriptions_exceptions_1.SubscriptionProductFound();
                const record = yield this.model.create({ product_id, name: product.data.name, price_id: product.data.default_price });
                return res.status(201).json({ record });
            }
            catch (error) {
                if (error.response)
                    return res.status(error.response.status).json({ message: error.response.statusText });
                return res.status(500).json({ message: error.message });
            }
        });
    }
}
exports.default = SubscriptionController;
