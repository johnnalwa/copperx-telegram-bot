import axios from 'axios';
import config from '../config';

const api = axios.create({
  baseURL: config.api.baseUrl,
});

// Get all wallets
export const getWallets = async (token: string) => {
  try {
    const response = await api.get('/api/wallets', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error getting wallets:', error);
    return { success: false, error };
  }
};

// Get wallet balances
export const getBalances = async (token: string) => {
  try {
    const response = await api.get('/api/wallets/balances', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error getting balances:', error);
    return { success: false, error };
  }
};

// Set default wallet
export const setDefaultWallet = async (token: string, walletId: string) => {
  try {
    const response = await api.put('/api/wallets/default', 
      { walletId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error setting default wallet:', error);
    return { success: false, error };
  }
};

// Get transaction history
export const getTransactionHistory = async (token: string, page = 1, limit = 10) => {
  try {
    const response = await api.get(`/api/transfers?page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error getting transaction history:', error);
    return { success: false, error };
  }
};