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
exports.getKYCStatus = exports.getUserProfile = exports.authenticateWithOTP = exports.requestEmailOTP = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../config"));
const api = axios_1.default.create({
    baseURL: config_1.default.api.baseUrl,
});
// Request email OTP
const requestEmailOTP = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield api.post('/api/auth/email-otp/request', { email });
        return { success: true, data: response.data };
    }
    catch (error) {
        console.error('Error requesting OTP:', error);
        return { success: false, error };
    }
});
exports.requestEmailOTP = requestEmailOTP;
// Authenticate with OTP
const authenticateWithOTP = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield api.post('/api/auth/email-otp/authenticate', {
            email,
            otp
        });
        return { success: true, data: response.data };
    }
    catch (error) {
        console.error('Error authenticating:', error);
        return { success: false, error };
    }
});
exports.authenticateWithOTP = authenticateWithOTP;
// Get user profile
const getUserProfile = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield api.get('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return { success: true, data: response.data };
    }
    catch (error) {
        console.error('Error getting user profile:', error);
        return { success: false, error };
    }
});
exports.getUserProfile = getUserProfile;
// Get KYC status
const getKYCStatus = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield api.get('/api/kycs', {
            headers: { Authorization: `Bearer ${token}` }
        });
        return { success: true, data: response.data };
    }
    catch (error) {
        console.error('Error getting KYC status:', error);
        return { success: false, error };
    }
});
exports.getKYCStatus = getKYCStatus;
