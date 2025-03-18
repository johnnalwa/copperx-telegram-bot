"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatErrorMessage = exports.formatTransferConfirmation = exports.formatProfileMessage = exports.formatTransactionHistory = exports.formatBalanceMessage = exports.formatTransactionStatus = exports.formatDate = exports.formatAmount = void 0;
// Format currency amount
const formatAmount = (amount, currency = 'USDC') => {
    return `${amount.toFixed(2)} ${currency}`;
};
exports.formatAmount = formatAmount;
// Format date from ISO string
const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};
exports.formatDate = formatDate;
// Format transaction status with emojis
const formatTransactionStatus = (status) => {
    const statusEmojis = {
        'COMPLETED': '✅',
        'PENDING': '⏳',
        'FAILED': '❌',
        'PROCESSING': '🔄',
        'CANCELLED': '🚫'
    };
    const emoji = statusEmojis[status] || '❓';
    return `${emoji} ${status}`;
};
exports.formatTransactionStatus = formatTransactionStatus;
// Format wallet balance message
const formatBalanceMessage = (balances) => {
    if (!balances || balances.length === 0) {
        return '💰 *Your Wallet Balances*\n\nNo balances found.';
    }
    let message = '💰 *Your Wallet Balances*\n\n';
    balances.forEach((balance) => {
        message += `*${balance.currency}*: ${balance.balance.toFixed(2)} on ${balance.network}\n`;
    });
    return message;
};
exports.formatBalanceMessage = formatBalanceMessage;
// Format transaction history
const formatTransactionHistory = (transactions) => {
    if (!transactions || transactions.length === 0) {
        return '📋 *Recent Transactions*\n\nNo transactions found.';
    }
    let message = '📋 *Recent Transactions*\n\n';
    transactions.slice(0, 10).forEach((tx, index) => {
        const date = (0, exports.formatDate)(tx.createdAt);
        const type = tx.type === 'DEPOSIT' ? '⬇️ Deposit' :
            tx.type === 'WITHDRAWAL' ? '⬆️ Withdrawal' :
                tx.type === 'TRANSFER' ? '↔️ Transfer' : tx.type;
        message += `${index + 1}. ${type}\n`;
        message += `   Amount: ${(0, exports.formatAmount)(tx.amount, tx.currency)}\n`;
        message += `   Date: ${date}\n`;
        message += `   Status: ${(0, exports.formatTransactionStatus)(tx.status)}\n\n`;
    });
    return message;
};
exports.formatTransactionHistory = formatTransactionHistory;
// Format profile message
const formatProfileMessage = (profile, kycStatus) => {
    var _a;
    let message = '👤 *Your Profile*\n\n';
    if (profile) {
        message += `Name: ${profile.firstName || ''} ${profile.lastName || ''}\n`;
        message += `Email: ${profile.email || 'Not provided'}\n`;
        if (profile.phone) {
            message += `Phone: ${profile.phone}\n`;
        }
        message += `\n🏢 *Organization*: ${((_a = profile.defaultOrganization) === null || _a === void 0 ? void 0 : _a.name) || 'None'}\n`;
    }
    else {
        message += 'Profile information not available.\n';
    }
    if (kycStatus) {
        const statusEmojis = {
            'APPROVED': '✅',
            'PENDING': '⏳',
            'REJECTED': '❌',
            'NOT_SUBMITTED': '📝'
        };
        const emoji = statusEmojis[kycStatus.status] || '❓';
        message += `\n📝 *KYC Status*: ${emoji} ${kycStatus.status || 'Not submitted'}\n`;
        if (kycStatus.status !== 'APPROVED') {
            message += '\nYou need to complete KYC on the Copperx web app to use all features.';
        }
    }
    return message;
};
exports.formatProfileMessage = formatProfileMessage;
// Format confirmation message for transfers
const formatTransferConfirmation = (transferData) => {
    let message = '⚠️ *Please Confirm Transfer*\n\n';
    message += `Amount: ${(0, exports.formatAmount)(transferData.amount, transferData.currency)}\n`;
    if (transferData.type === 'email') {
        message += `To Email: ${transferData.recipient}\n`;
    }
    else if (transferData.type === 'wallet') {
        message += `To Wallet: ${transferData.recipient.substring(0, 10)}...${transferData.recipient.substring(transferData.recipient.length - 6)}\n`;
        message += `Network: ${transferData.network}\n`;
    }
    else if (transferData.type === 'bank') {
        message += `To Bank Account: ${transferData.recipient}\n`;
    }
    message += '\nPlease confirm this transfer by clicking the button below:';
    return message;
};
exports.formatTransferConfirmation = formatTransferConfirmation;
// Format error messages
const formatErrorMessage = (error) => {
    var _a, _b;
    let message = '❌ *Error*\n\n';
    if (typeof error === 'string') {
        message += error;
    }
    else if ((_b = (_a = error.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message) {
        message += error.response.data.message;
    }
    else if (error.message) {
        message += error.message;
    }
    else {
        message += 'An unknown error occurred. Please try again later.';
    }
    return message;
};
exports.formatErrorMessage = formatErrorMessage;
