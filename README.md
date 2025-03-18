# Copperx Telegram Bot

A Telegram bot for managing your Copperx account directly from Telegram. Built with Node.js and the Telegraf framework.

## Features

- **Authentication**
  - Email-based login with OTP verification
  - Secure session management
  - Automatic profile loading after authentication

- **Account Management**
  - View wallet balances
  - Check account profile
  - Real-time notifications via Pusher

- **Transaction Features**
  - Send funds to email addresses or wallet addresses
  - Bank withdrawals (requires web app setup)
  - View transaction history

- **Commands**
  - `/start` - Initialize the bot and get welcome message
  - `/login` - Start the authentication process
  - `/balance` - Check your wallet balances
  - `/send` - Initiate a fund transfer
  - `/withdraw` - Start a withdrawal process
  - `/history` - View your transaction history
  - `/profile` - View your account information
  - `/support` - Get help from Copperx support
  - `/help` - List all available commands

## Quick Keyboard Access

The bot provides a custom keyboard with quick access buttons:
- 💰 Balance
- 📤 Send
- 🏦 Withdraw
- 📋 History
- 👤 Profile
- ❓ Help

## Technical Stack

- TypeScript
- Node.js
- Telegraf (Telegram Bot Framework)
- Pusher (for real-time notifications)

## Security Features

- Session-based authentication
- OTP verification
- Secure token management
- Type-safe implementation with TypeScript


