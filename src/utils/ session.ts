import { Context } from 'telegraf';

// Define our session data structure
export interface SessionData {
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
    step?: 'recipient' | 'amount' | 'currency' | 'network' | 'confirmation';
  };
}

// Extended context that includes our session data
export interface SessionContext extends Context {
  session: SessionData;
}

// Check if user is authenticated
export const isAuthenticated = (ctx: SessionContext): boolean => {
  return Boolean(ctx.session?.token);
};

// Clear session data
export const clearSession = (ctx: SessionContext): void => {
  ctx.session = {};
};

// Save auth token
export const saveAuthToken = (ctx: SessionContext, token: string): void => {
  if (!ctx.session) {
    ctx.session = {};
  }
  ctx.session.token = token;
};

// Save organization ID
export const saveOrganizationId = (ctx: SessionContext, orgId: string): void => {
  if (!ctx.session) {
    ctx.session = {};
  }
  ctx.session.organizationId = orgId;
};

// Initialize transfer state
export const initTransferState = (
  ctx: SessionContext, 
  type: 'email' | 'wallet' | 'bank'
): void => {
  if (!ctx.session) {
    ctx.session = {};
  }
  ctx.session.transferState = {
    type,
    step: 'recipient'
  };
};

// Update transfer state
export const updateTransferState = (
  ctx: SessionContext,
  update: Partial<SessionData['transferState']>
): void => {
  if (!ctx.session) {
    ctx.session = {};
  }
  if (!ctx.session.transferState) {
    ctx.session.transferState = {};
  }
  
  ctx.session.transferState = {
    ...ctx.session.transferState,
    ...update
  };
};

// Clear transfer state
export const clearTransferState = (ctx: SessionContext): void => {
  if (ctx.session) {
    ctx.session.transferState = undefined;
  }
};

// Save wallets data
export const saveWallets = (ctx: SessionContext, wallets: any[]): void => {
  if (!ctx.session) {
    ctx.session = {};
  }
  ctx.session.wallets = wallets;
};