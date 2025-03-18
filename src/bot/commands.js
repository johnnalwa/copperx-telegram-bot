"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCommands = void 0;
const filters_1 = require("telegraf/filters");
const telegraf_1 = require("telegraf");
const authService = __importStar(require("../services/auth"));
const walletService = __importStar(require("../services/wallet"));
const notification_1 = require("../services/notification");
const registerCommands = (bot) => {
    // Login command
    bot.command('login', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        ctx.session = {}; // Reset session
        ctx.session.loginState = 'awaiting_email';
        yield ctx.reply('Please enter your Copperx email address:');
    }));
    // Handle email input for login
    bot.on((0, filters_1.message)('text'), (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        if (ctx.session.loginState === 'awaiting_email') {
            const email = ctx.message.text.trim();
            // Simple email validation
            if (!email.includes('@')) {
                return ctx.reply('Please enter a valid email address.');
            }
            ctx.session.email = email;
            const result = yield authService.requestEmailOTP(email);
            if (result.success) {
                ctx.session.loginState = 'awaiting_otp';
                yield ctx.reply('We\'ve sent an OTP to your email. Please enter it:');
            }
            else {
                yield ctx.reply('Failed to send OTP. Please try again.');
                ctx.session.loginState = undefined;
            }
            return;
        }
        if (ctx.session.loginState === 'awaiting_otp') {
            const otp = ctx.message.text.trim();
            if (!ctx.session.email) {
                yield ctx.reply('Session error. Please start over with /login');
                return;
            }
            const result = yield authService.authenticateWithOTP(ctx.session.email, otp);
            if (result.success && ((_a = result.data) === null || _a === void 0 ? void 0 : _a.token)) {
                ctx.session.token = result.data.token;
                // Get user profile
                const profileResult = yield authService.getUserProfile(ctx.session.token);
                if (profileResult.success) {
                    ctx.session.organizationId = (_b = profileResult.data.defaultOrganization) === null || _b === void 0 ? void 0 : _b.id;
                    // Setup notifications
                    if (ctx.session.organizationId) {
                        (0, notification_1.setupPusherNotifications)(ctx.session.token, ctx.session.organizationId, ctx.chat.id);
                    }
                    yield ctx.reply(`✅ Login successful!\n\nWelcome to Copperx Payout Bot. Use /help to see available commands.`, telegraf_1.Markup.keyboard([
                        ['💰 Balance', '📤 Send', '🏦 Withdraw'],
                        ['📋 History', '👤 Profile', '❓ Help']
                    ]).resize());
                }
                else {
                    yield ctx.reply('Login successful, but failed to get profile information.');
                }
                ctx.session.loginState = undefined;
            }
            else {
                yield ctx.reply('Invalid OTP. Please try again or use /login to start over.');
            }
            return;
        }
        // Handle other message flows here...
        // This would include handling transfer amounts, recipient info, etc.
    }));
    // Balance command
    bot.command('balance', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        return yield handleBalance(ctx);
    }));
    bot.hears('💰 Balance', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        return yield handleBalance(ctx);
    }));
    // Send command
    bot.command('send', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        return yield handleSend(ctx);
    }));
    bot.hears('📤 Send', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        return yield handleSend(ctx);
    }));
    // Withdraw command
    bot.command('withdraw', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        return yield handleWithdraw(ctx);
    }));
    bot.hears('🏦 Withdraw', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        return yield handleWithdraw(ctx);
    }));
    // History command
    bot.command('history', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        return yield handleHistory(ctx);
    }));
    bot.hears('📋 History', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        return yield handleHistory(ctx);
    }));
    // Profile command
    bot.command('profile', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        return yield handleProfile(ctx);
    }));
    bot.hears('👤 Profile', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        return yield handleProfile(ctx);
    }));
    // Support command
    bot.command('support', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        yield ctx.reply('Need help? Contact Copperx support here:\nhttps://t.me/copperxcommunity/2183');
    }));
    // Help command
    bot.hears('❓ Help', (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        yield ctx.help();
    }));
    // Handle action buttons
    bot.action(/send_type:(.+)/, (ctx) => __awaiter(void 0, void 0, void 0, function* () {
        const type = ctx.match[1];
        if (!ctx.session.transferState) {
            ctx.session.transferState = {};
        }
        ctx.session.transferState.type = type;
        if (type === 'email') {
            yield ctx.editMessageText('Please enter the recipient\'s email address:');
        }
        else if (type === 'wallet') {
            yield ctx.editMessageText('Please enter the wallet address:');
        }
        else if (type === 'bank') {
            // This would require getting the user's bank accounts first
            yield ctx.editMessageText('Bank withdrawal requires setup on the Copperx web app first. Visit app.copperx.io');
        }
    }));
};
exports.registerCommands = registerCommands;
// Helper functions for command handlers
function handleBalance(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!ctx.session.token) {
            return yield ctx.reply('You need to log in first. Use /login');
        }
        const result = yield walletService.getBalances(ctx.session.token);
        if (result.success && result.data) {
            let message = '💰 *Your Wallet Balances*\n\n';
            if (result.data.length === 0) {
                message += 'No balances found.';
            }
            else {
                result.data.forEach((balance) => {
                    message += `*${balance.currency}*: ${balance.balance} on ${balance.network}\n`;
                });
            }
            yield ctx.reply(message, { parse_mode: 'Markdown' });
        }
        else {
            yield ctx.reply('Failed to fetch balances. Please try again later.');
        }
    });
}
function handleSend(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!ctx.session.token) {
            return yield ctx.reply('You need to log in first. Use /login');
        }
        yield ctx.reply('How would you like to send funds?', telegraf_1.Markup.inlineKeyboard([
            telegraf_1.Markup.button.callback('Email', 'send_type:email'),
            telegraf_1.Markup.button.callback('Wallet Address', 'send_type:wallet')
        ]));
    });
}
function handleWithdraw(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!ctx.session.token) {
            return yield ctx.reply('You need to log in first. Use /login');
        }
        yield ctx.reply('Withdrawal to bank accounts requires setting up banking information in the Copperx web app first.\n\n' +
            'Please visit app.copperx.io to set up your bank account, then you can use this bot for withdrawals.');
    });
}
function handleHistory(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!ctx.session.token) {
            return yield ctx.reply('You need to log in first. Use /login');
        }
        const result = yield walletService.getTransactionHistory(ctx.session.token);
        if (result.success && result.data) {
            let message = '📋 *Recent Transactions*\n\n';
            if (result.data.length === 0) {
                message += 'No transactions found.';
            }
            else {
                result.data.forEach((tx, index) => {
                    if (index < 10) { // Only show last 10
                        const date = new Date(tx.createdAt).toLocaleDateString();
                        message += `${date}: ${tx.type} - ${tx.amount} ${tx.currency}\n`;
                        message += `Status: ${tx.status}\n\n`;
                    }
                });
            }
            yield ctx.reply(message, { parse_mode: 'Markdown' });
        }
        else {
            yield ctx.reply('Failed to fetch transaction history. Please try again later.');
        }
    });
}
function handleProfile(ctx) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!ctx.session.token) {
            return yield ctx.reply('You need to log in first. Use /login');
        }
        const profileResult = yield authService.getUserProfile(ctx.session.token);
        const kycResult = yield authService.getKYCStatus(ctx.session.token);
        if (profileResult.success && profileResult.data) {
            const profile = profileResult.data;
            let message = '👤 *Your Profile*\n\n';
            message += `Name: ${profile.firstName} ${profile.lastName}\n`;
            message += `Email: ${profile.email}\n`;
            if (kycResult.success && kycResult.data) {
                const kyc = kycResult.data;
                message += `\n📝 *KYC Status*: ${kyc.status || 'Not submitted'}\n`;
                if (kyc.status !== 'APPROVED') {
                    message += '\nYou need to complete KYC on the Copperx web app to use all features.';
                }
            }
            yield ctx.reply(message, { parse_mode: 'Markdown' });
        }
        else {
            yield ctx.reply('Failed to fetch profile information. Please try again later.');
        }
    });
}
