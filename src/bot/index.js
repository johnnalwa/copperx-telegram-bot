"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const config_1 = __importDefault(require("../config"));
const commands_1 = require("./commands");
const bot = new telegraf_1.Telegraf(config_1.default.telegram.botToken);
// Session middleware with default state
bot.use((0, telegraf_1.session)({
  defaultSession: () => ({
    loginState: undefined,
    email: undefined,
    token: undefined,
    organizationId: undefined,
    wallets: undefined,
    transferState: undefined
  })
}));
// Register commands
(0, commands_1.registerCommands)(bot);
// Start handler
bot.start(async (ctx) => {
    console.log('Start command received');
    try {
        console.log('Sending welcome message...');
        await ctx.reply(
            `Welcome to Copperx Payout Bot! 🚀\n\n` +
            `This bot allows you to manage your Copperx account directly from Telegram.\n\n` +
            `Please use /login to get started, or /help to see all available commands.`,
            {
                parse_mode: 'Markdown',
                reply_markup: {
                    keyboard: [
                        ['💰 Balance', '📤 Send', '🏦 Withdraw'],
                        ['📋 History', '👤 Profile', '❓ Help']
                    ],
                    resize_keyboard: true
                }
            }
        );
        console.log('Welcome message sent successfully');
    } catch (error) {
        console.error('Error in start command:', error);
        // Try sending a simpler message if the first one fails
        try {
            await ctx.reply('Welcome to Copperx Payout Bot! Please use /login to get started.');
        } catch (retryError) {
            console.error('Failed to send simple message:', retryError);
        }
    }
});
// Help command
bot.help((ctx) => {
    ctx.reply(`Copperx Payout Bot Commands:\n\n` +
        `/login - Authenticate with your Copperx account\n` +
        `/balance - View your wallet balances\n` +
        `/send - Send funds to an email or wallet\n` +
        `/withdraw - Withdraw funds to bank account\n` +
        `/history - View recent transactions\n` +
        `/profile - View your account profile\n` +
        `/support - Get help from Copperx support\n\n` +
        `Need more help? Visit: https://t.me/copperxcommunity/2183`);
});
exports.default = bot;
