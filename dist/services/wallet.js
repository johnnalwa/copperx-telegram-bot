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
exports.getTransactionHistory = exports.setDefaultWallet = exports.getBalances = exports.getWallets = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../config"));
const api = axios_1.default.create({
    baseURL: config_1.default.api.baseUrl,
});
// Get all wallets
const getWallets = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield api.get('/api/wallets', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return { success: true, data: response.data };
    }
    catch (error) {
        console.error('Error getting wallets:', error);
        return { success: false, error };
    }
});
exports.getWallets = getWallets;
// Get wallet balances
const getBalances = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield api.get('/api/wallets/balances', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return { success: true, data: response.data };
    }
    catch (error) {
        console.error('Error getting balances:', error);
        return { success: false, error };
    }
});
exports.getBalances = getBalances;
// Set default wallet
const setDefaultWallet = (token, walletId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield api.put('/api/wallets/default', { walletId }, { headers: { Authorization: `Bearer ${token}` } });
        return { success: true, data: response.data };
    }
    catch (error) {
        console.error('Error setting default wallet:', error);
        return { success: false, error };
    }
});
exports.setDefaultWallet = setDefaultWallet;
// Get transaction history
const getTransactionHistory = (token_1, ...args_1) => __awaiter(void 0, [token_1, ...args_1], void 0, function* (token, page = 1, limit = 10) {
    try {
        const response = yield api.get(`/api/transfers?page=${page}&limit=${limit}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return { success: true, data: response.data };
    }
    catch (error) {
        console.error('Error getting transaction history:', error);
        return { success: false, error };
    }
});
exports.getTransactionHistory = getTransactionHistory;
