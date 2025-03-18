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
exports.withdrawToBank = exports.sendToWallet = exports.sendToEmail = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../config"));
const api = axios_1.default.create({
    baseURL: config_1.default.api.baseUrl,
});
// Send funds to email
const sendToEmail = (token, params) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield api.post('/api/transfers/send', params, { headers: { Authorization: `Bearer ${token}` } });
        return { success: true, data: response.data };
    }
    catch (error) {
        console.error('Error sending to email:', error);
        return { success: false, error };
    }
});
exports.sendToEmail = sendToEmail;
// Send funds to external wallet
const sendToWallet = (token, params) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield api.post('/api/transfers/wallet-withdraw', params, { headers: { Authorization: `Bearer ${token}` } });
        return { success: true, data: response.data };
    }
    catch (error) {
        console.error('Error sending to wallet:', error);
        return { success: false, error };
    }
});
exports.sendToWallet = sendToWallet;
// Withdraw to bank
const withdrawToBank = (token, params) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield api.post('/api/transfers/offramp', params, { headers: { Authorization: `Bearer ${token}` } });
        return { success: true, data: response.data };
    }
    catch (error) {
        console.error('Error withdrawing to bank:', error);
        return { success: false, error };
    }
});
exports.withdrawToBank = withdrawToBank;
