import { Telegraf, session, Context } from 'telegraf';
import { MyContext } from './commands';
import config from '../config';
import { registerCommands } from './commands';

const bot = new Telegraf<MyContext>(config.telegram.botToken);

// Session middleware
bot.use(session());

// Register commands
registerCommands(bot);

// Start handler
bot.start((ctx) => {
  ctx.reply(
    `Welcome to Copperx Payout Bot! 🚀\n\n` +
    `This bot allows you to manage your Copperx account directly from Telegram.\n\n` +
    `Please use /login to get started, or /help to see all available commands.`
  );
});

// Help command
bot.help((ctx) => {
  ctx.reply(
    `Copperx Payout Bot Commands:\n\n` +
    `/login - Authenticate with your Copperx account\n` +
    `/balance - View your wallet balances\n` +
    `/send - Send funds to an email or wallet\n` +
    `/withdraw - Withdraw funds to bank account\n` +
    `/history - View recent transactions\n` +
    `/profile - View your account profile\n` +
    `/support - Get help from Copperx support\n\n` +
    `Need more help? Visit: https://t.me/copperxcommunity/2183`
  );
});

export default bot;