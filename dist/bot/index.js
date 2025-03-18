"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const config_1 = __importDefault(require("../config"));
const commands_1 = require("./commands");
const bot = new telegraf_1.Telegraf(config_1.default.telegram.botToken);
// Session middleware
bot.use((0, telegraf_1.session)());
// Register commands
(0, commands_1.registerCommands)(bot);
// Start handler
bot.start((ctx) => {
    ctx.reply(`Welcome to Copperx Payout Bot! 🚀\n\n` +
        `This bot allows you to manage your Copperx account directly from Telegram.\n\n` +
        `Please use /login to get started, or /help to see all available commands.`);
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
