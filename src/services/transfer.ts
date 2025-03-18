import axios from 'axios';
import config from '../config';

const api = axios.create({
  baseURL: config.api.baseUrl,
});

// Send funds to email
export const sendToEmail = async (token: string, params: {
  recipient: string;
  amount: number;
  currency: string;
  message?: string;
}) => {
  try {
    const response = await api.post('/api/transfers/send', 
      params,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error sending to email:', error);
    return { success: false, error };
  }
};

// Send funds to external wallet
export const sendToWallet = async (token: string, params: {
  address: string;
  amount: number;
  currency: string;
  network: string;
}) => {
  try {
    const response = await api.post('/api/transfers/wallet-withdraw', 
      params,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error sending to wallet:', error);
    return { success: false, error };
  }
};

// Withdraw to bank
export const withdrawToBank = async (token: string, params: {
  amount: number;
  currency: string;
  bankAccountId: string;
}) => {
  try {
    const response = await api.post('/api/transfers/offramp', 
      params,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error withdrawing to bank:', error);
    return { success: false, error };
  }
};