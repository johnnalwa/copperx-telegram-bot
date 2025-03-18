"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bot_1 = __importDefault(require("./bot"));
// Log the bot token (first few characters)
console.log('Bot token starts with:', bot_1.default.token.substring(0, 5));

// Start the bot
bot_1.default.launch().then(() => {
    console.log('Copperx Payout Bot is running!');
    
    // Add webhook info logging
    bot_1.default.telegram.getWebhookInfo().then(info => {
        console.log('Webhook info:', info);
    }).catch(err => {
        console.error('Failed to get webhook info:', err);
    });
}).catch((err) => {
    console.error('Failed to start bot:', err);
});
// Enable graceful stop
process.once('SIGINT', () => bot_1.default.stop('SIGINT'));
process.once('SIGTERM', () => bot_1.default.stop('SIGTERM'));
