import axios from 'axios';
import config from '../config';

const api = axios.create({
  baseURL: config.api.baseUrl,
});

// Request email OTP
export const requestEmailOTP = async (email: string) => {
  try {
    const response = await api.post('/api/auth/email-otp/request', { email });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error requesting OTP:', error);
    return { success: false, error };
  }
};

// Authenticate with OTP
export const authenticateWithOTP = async (email: string, otp: string) => {
  try {
    const response = await api.post('/api/auth/email-otp/authenticate', { 
      email, 
      otp 
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error authenticating:', error);
    return { success: false, error };
  }
};

// Get user profile
export const getUserProfile = async (token: string) => {
  try {
    const response = await api.get('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return { success: false, error };
  }
};

// Get KYC status
export const getKYCStatus = async (token: string) => {
  try {
    const response = await api.get('/api/kycs', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error getting KYC status:', error);
    return { success: false, error };
  }
};