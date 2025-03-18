import dotenv from 'dotenv';
dotenv.config();

export default {
  telegram: {
    botToken: process.env.BOT_TOKEN || '',
  },
  api: {
    baseUrl: process.env.API_BASE_URL || 'https://income-api.copperx.io',
  },
  pusher: {
    key: process.env.PUSHER_KEY || '',
    cluster: process.env.PUSHER_CLUSTER || '',
  }
};