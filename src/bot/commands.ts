import { Telegraf, Context } from 'telegraf';
import { message } from 'telegraf/filters';
import { Markup } from 'telegraf';
import * as authService from '../services/auth';
import * as walletService from '../services/wallet';
import * as transferService from '../services/transfer';
import { setupPusherNotifications } from '../services/notification';

// Session type
interface SessionData {
  loginState?: 'awaiting_email' | 'awaiting_otp';
  email?: string;
  token?: string;
  organizationId?: string;
  wallets?: any[];
  transferState?: {
    type?: 'email' | 'wallet' | 'bank';
    recipient?: string;
    amount?: number;
    currency?: string;
    network?: string;
  }
}

export interface MyContext extends Context {
  session: SessionData;
  help(): Promise<void>;
}

export const registerCommands = (bot: Telegraf<MyContext>) => {
  // Login command
  bot.command('login', async (ctx) => {
    ctx.session = {}; // Reset session
    ctx.session.loginState = 'awaiting_email';
    
    await ctx.reply('Please enter your Copperx email address:');
  });

  // Handle email input for login
  bot.on(message('text'), async (ctx) => {
    if (ctx.session.loginState === 'awaiting_email') {
      const email = ctx.message.text.trim();
      // Simple email validation
      if (!email.includes('@')) {
        return ctx.reply('Please enter a valid email address.');
      }
      
      ctx.session.email = email;
      const result = await authService.requestEmailOTP(email);
      
      if (result.success) {
        ctx.session.loginState = 'awaiting_otp';
        await ctx.reply('We\'ve sent an OTP to your email. Please enter it:');
      } else {
        await ctx.reply('Failed to send OTP. Please try again.');
        ctx.session.loginState = undefined;
      }
      return;
    }
    
    if (ctx.session.loginState === 'awaiting_otp') {
      const otp = ctx.message.text.trim();
      if (!ctx.session.email) {
        await ctx.reply('Session error. Please start over with /login');
        return;
      }
      
      const result = await authService.authenticateWithOTP(ctx.session.email, otp);
      
      if (result.success && result.data?.token) {
        ctx.session.token = result.data.token;
        
        // Get user profile
        if (!ctx.session.token) {
          await ctx.reply('Session error. Please try again with /login');
          return;
        }
        const profileResult = await authService.getUserProfile(ctx.session.token);
        if (profileResult.success) {
          ctx.session.organizationId = profileResult.data.defaultOrganization?.id;
          
          // Setup notifications
          if (ctx.session.organizationId) {
            if (ctx.session.token) {
              setupPusherNotifications(
                ctx.session.token,
                ctx.session.organizationId,
                ctx.chat.id
              );
            }
          }
          
          await ctx.reply(
            `✅ Login successful!\n\nWelcome to Copperx Payout Bot. Use /help to see available commands.`,
            Markup.keyboard([
              ['💰 Balance', '📤 Send', '🏦 Withdraw'],
              ['📋 History', '👤 Profile', '❓ Help']
            ]).resize()
          );
        } else {
          await ctx.reply('Login successful, but failed to get profile information.');
        }
        
        ctx.session.loginState = undefined;
      } else {
        await ctx.reply('Invalid OTP. Please try again or use /login to start over.');
      }
      return;
    }
    
    // Handle other message flows here...
    // This would include handling transfer amounts, recipient info, etc.
  });

  // Balance command
  bot.command('balance', async (ctx) => {
    return await handleBalance(ctx);
  });
  
  bot.hears('💰 Balance', async (ctx) => {
    return await handleBalance(ctx);
  });

  // Send command
  bot.command('send', async (ctx) => {
    return await handleSend(ctx);
  });
  
  bot.hears('📤 Send', async (ctx) => {
    return await handleSend(ctx);
  });

  // Withdraw command
  bot.command('withdraw', async (ctx) => {
    return await handleWithdraw(ctx);
  });
  
  bot.hears('🏦 Withdraw', async (ctx) => {
    return await handleWithdraw(ctx);
  });

  // History command
  bot.command('history', async (ctx) => {
    return await handleHistory(ctx);
  });
  
  bot.hears('📋 History', async (ctx) => {
    return await handleHistory(ctx);
  });

  // Profile command
  bot.command('profile', async (ctx) => {
    return await handleProfile(ctx);
  });
  
  bot.hears('👤 Profile', async (ctx) => {
    return await handleProfile(ctx);
  });

  // Support command
  bot.command('support', async (ctx) => {
    await ctx.reply(
      'Need help? Contact Copperx support here:\nhttps://t.me/copperxcommunity/2183'
    );
  });
  
  // Help command
  bot.hears('❓ Help', async (ctx) => {
    await ctx.reply(
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

  // Handle action buttons
  bot.action(/send_type:(.+)/, async (ctx) => {
    const type = ctx.match[1];
    if (!ctx.session.transferState) {
      ctx.session.transferState = {};
    }
    ctx.session.transferState.type = type as 'email' | 'wallet' | 'bank';
    
    if (type === 'email') {
      await ctx.editMessageText('Please enter the recipient\'s email address:');
    } else if (type === 'wallet') {
      await ctx.editMessageText('Please enter the wallet address:');
    } else if (type === 'bank') {
      // This would require getting the user's bank accounts first
      await ctx.editMessageText('Bank withdrawal requires setup on the Copperx web app first. Visit app.copperx.io');
    }
  });
};

// Helper functions for command handlers
async function handleBalance(ctx: MyContext) {
  if (!ctx.session.token) {
    return await ctx.reply('You need to log in first. Use /login');
  }
  
  const result = await walletService.getBalances(ctx.session.token);
  
  if (result.success && result.data) {
    let message = '💰 *Your Wallet Balances*\n\n';
    
    if (result.data.length === 0) {
      message += 'No balances found.';
    } else {
      result.data.forEach((balance: any) => {
        message += `*${balance.currency}*: ${balance.balance} on ${balance.network}\n`;
      });
    }
    
    await ctx.reply(message, { parse_mode: 'Markdown' });
  } else {
    await ctx.reply('Failed to fetch balances. Please try again later.');
  }
}

async function handleSend(ctx: MyContext) {
  if (!ctx.session.token) {
    return await ctx.reply('You need to log in first. Use /login');
  }
  
  await ctx.reply(
    'How would you like to send funds?',
    Markup.inlineKeyboard([
      Markup.button.callback('Email', 'send_type:email'),
      Markup.button.callback('Wallet Address', 'send_type:wallet')
    ])
  );
}

async function handleWithdraw(ctx: MyContext) {
  if (!ctx.session.token) {
    return await ctx.reply('You need to log in first. Use /login');
  }
  
  await ctx.reply(
    'Withdrawal to bank accounts requires setting up banking information in the Copperx web app first.\n\n' +
    'Please visit app.copperx.io to set up your bank account, then you can use this bot for withdrawals.'
  );
}

async function handleHistory(ctx: MyContext) {
  if (!ctx.session.token) {
    return await ctx.reply('You need to log in first. Use /login');
  }
  
  const result = await walletService.getTransactionHistory(ctx.session.token);
  
  if (result.success && result.data) {
    let message = '📋 *Recent Transactions*\n\n';
    
    if (result.data.length === 0) {
      message += 'No transactions found.';
    } else {
      result.data.forEach((tx: any, index: number) => {
        if (index < 10) { // Only show last 10
          const date = new Date(tx.createdAt).toLocaleDateString();
          message += `${date}: ${tx.type} - ${tx.amount} ${tx.currency}\n`;
          message += `Status: ${tx.status}\n\n`;
        }
      });
    }
    
    await ctx.reply(message, { parse_mode: 'Markdown' });
  } else {
    await ctx.reply('Failed to fetch transaction history. Please try again later.');
  }
}

async function handleProfile(ctx: MyContext) {
  if (!ctx.session.token) {
    return await ctx.reply('You need to log in first. Use /login');
  }
  
  const profileResult = await authService.getUserProfile(ctx.session.token);
  const kycResult = await authService.getKYCStatus(ctx.session.token);
  
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
    
    await ctx.reply(message, { parse_mode: 'Markdown' });
  } else {
    await ctx.reply('Failed to fetch profile information. Please try again later.');
  }
}