import Pusher from 'pusher-js';
import axios from 'axios';
import config from '../config';
import bot from '../bot';

export const setupPusherNotifications = (token: string, organizationId: string, chatId: number) => {
  // Initialize Pusher client with authentication
  const pusherClient = new Pusher(config.pusher.key, {
    cluster: config.pusher.cluster,
    authorizer: (channel) => ({
      authorize: async (socketId, callback) => {
        try {
          const response = await axios.post(
            `${config.api.baseUrl}/api/notifications/auth`,
            {
              socket_id: socketId,
              channel_name: channel.name
            },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );

          if (response.data) {
            callback(null, response.data);
          } else {
            callback(new Error('Pusher authentication failed'), null);
          }
        } catch (error) {
          console.error('Pusher authorization error:', error);
          callback(error as Error, null);
        }
      }
    })
  });

  // Subscribe to organization's private channel
  const channel = pusherClient.subscribe(`private-org-${organizationId}`);

  channel.bind('pusher:subscription_succeeded', () => {
    console.log('Successfully subscribed to private channel');
  });

  channel.bind('pusher:subscription_error', (error: any) => {
    console.error('Subscription error:', error);
  });

  // Bind to the deposit event
  channel.bind('deposit', (data: any) => {
    bot.telegram.sendMessage(
      chatId,
      `💰 *New Deposit Received*\n\n` +
      `${data.amount} USDC deposited on ${data.network || 'Solana'}`,
      { parse_mode: 'Markdown' }
    );
  });

  return pusherClient;
};