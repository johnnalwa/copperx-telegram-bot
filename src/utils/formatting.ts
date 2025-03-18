// Format currency amount
export const formatAmount = (amount: number, currency: string = 'USDC'): string => {
  return `${amount.toFixed(2)} ${currency}`;
};

// Format date from ISO string
export const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Format transaction status with emojis
export const formatTransactionStatus = (status: string): string => {
  const statusEmojis: Record<string, string> = {
    'COMPLETED': '✅',
    'PENDING': '⏳',
    'FAILED': '❌',
    'PROCESSING': '🔄',
    'CANCELLED': '🚫'
  };
  
  const emoji = statusEmojis[status] || '❓';
  return `${emoji} ${status}`;
};

// Format wallet balance message
export const formatBalanceMessage = (balances: any[]): string => {
  if (!balances || balances.length === 0) {
    return '💰 *Your Wallet Balances*\n\nNo balances found.';
  }
  
  let message = '💰 *Your Wallet Balances*\n\n';
  
  balances.forEach((balance) => {
    message += `*${balance.currency}*: ${balance.balance.toFixed(2)} on ${balance.network}\n`;
  });
  
  return message;
};

// Format transaction history
export const formatTransactionHistory = (transactions: any[]): string => {
  if (!transactions || transactions.length === 0) {
    return '📋 *Recent Transactions*\n\nNo transactions found.';
  }
  
  let message = '📋 *Recent Transactions*\n\n';
  
  transactions.slice(0, 10).forEach((tx, index) => {
    const date = formatDate(tx.createdAt);
    const type = tx.type === 'DEPOSIT' ? '⬇️ Deposit' :
                tx.type === 'WITHDRAWAL' ? '⬆️ Withdrawal' :
                tx.type === 'TRANSFER' ? '↔️ Transfer' : tx.type;
    
    message += `${index + 1}. ${type}\n`;
    message += `   Amount: ${formatAmount(tx.amount, tx.currency)}\n`;
    message += `   Date: ${date}\n`;
    message += `   Status: ${formatTransactionStatus(tx.status)}\n\n`;
  });
  
  return message;
};

// Format profile message
export const formatProfileMessage = (profile: any, kycStatus: any): string => {
  let message = '👤 *Your Profile*\n\n';
  
  if (profile) {
    message += `Name: ${profile.firstName || ''} ${profile.lastName || ''}\n`;
    message += `Email: ${profile.email || 'Not provided'}\n`;
    
    if (profile.phone) {
      message += `Phone: ${profile.phone}\n`;
    }
    
    message += `\n🏢 *Organization*: ${profile.defaultOrganization?.name || 'None'}\n`;
  } else {
    message += 'Profile information not available.\n';
  }
  
  if (kycStatus) {
    const statusEmojis: Record<string, string> = {
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

// Format confirmation message for transfers
export const formatTransferConfirmation = (transferData: {
  type: 'email' | 'wallet' | 'bank';
  recipient: string;
  amount: number;
  currency: string;
  network?: string;
}): string => {
  let message = '⚠️ *Please Confirm Transfer*\n\n';
  
  message += `Amount: ${formatAmount(transferData.amount, transferData.currency)}\n`;
  
  if (transferData.type === 'email') {
    message += `To Email: ${transferData.recipient}\n`;
  } else if (transferData.type === 'wallet') {
    message += `To Wallet: ${transferData.recipient.substring(0, 10)}...${transferData.recipient.substring(transferData.recipient.length - 6)}\n`;
    message += `Network: ${transferData.network}\n`;
  } else if (transferData.type === 'bank') {
    message += `To Bank Account: ${transferData.recipient}\n`;
  }
  
  message += '\nPlease confirm this transfer by clicking the button below:';
  
  return message;
};

// Format error messages
export const formatErrorMessage = (error: any): string => {
  let message = '❌ *Error*\n\n';
  
  if (typeof error === 'string') {
    message += error;
  } else if (error.response?.data?.message) {
    message += error.response.data.message;
  } else if (error.message) {
    message += error.message;
  } else {
    message += 'An unknown error occurred. Please try again later.';
  }
  
  return message;
};