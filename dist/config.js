"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = {
    telegram: {
        botToken: process.env.BOT_TOKEN || '',
    },
    api: {
        baseUrl: process.env.API_BASE_URL || 'https://income-api.copperx.io',
    },
    pusher: {
        key: process.env.PUSHER_KEY || '',
        cluster: process.env.PUSHER_CLUSTER || '',
    }
};
