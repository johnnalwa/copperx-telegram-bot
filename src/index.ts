import bot from './bot';

// Start the bot
bot.launch().then(() => {
  console.log('Copperx Payout Bot is running!');
}).catch((err) => {
  console.error('Failed to start bot:', err);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));