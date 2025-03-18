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
exports.setupPusherNotifications = void 0;
const pusher_js_1 = __importDefault(require("pusher-js"));
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../config"));
const bot_1 = __importDefault(require("../bot"));
const setupPusherNotifications = (token, organizationId, chatId) => {
    // Initialize Pusher client with authentication
    const pusherClient = new pusher_js_1.default(config_1.default.pusher.key, {
        cluster: config_1.default.pusher.cluster,
        authorizer: (channel) => ({
            authorize: (socketId, callback) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const response = yield axios_1.default.post(`${config_1.default.api.baseUrl}/api/notifications/auth`, {
                        socket_id: socketId,
                        channel_name: channel.name
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    if (response.data) {
                        callback(null, response.data);
                    }
                    else {
                        callback(new Error('Pusher authentication failed'), null);
                    }
                }
                catch (error) {
                    console.error('Pusher authorization error:', error);
                    callback(error, null);
                }
            })
        })
    });
    // Subscribe to organization's private channel
    const channel = pusherClient.subscribe(`private-org-${organizationId}`);
    channel.bind('pusher:subscription_succeeded', () => {
        console.log('Successfully subscribed to private channel');
    });
    channel.bind('pusher:subscription_error', (error) => {
        console.error('Subscription error:', error);
    });
    // Bind to the deposit event
    channel.bind('deposit', (data) => {
        bot_1.default.telegram.sendMessage(chatId, `💰 *New Deposit Received*\n\n` +
            `${data.amount} USDC deposited on ${data.network || 'Solana'}`, { parse_mode: 'Markdown' });
    });
    return pusherClient;
};
exports.setupPusherNotifications = setupPusherNotifications;
