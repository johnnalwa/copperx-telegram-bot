"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveWallets = exports.clearTransferState = exports.updateTransferState = exports.initTransferState = exports.saveOrganizationId = exports.saveAuthToken = exports.clearSession = exports.isAuthenticated = void 0;
// Check if user is authenticated
const isAuthenticated = (ctx) => {
    var _a;
    return Boolean((_a = ctx.session) === null || _a === void 0 ? void 0 : _a.token);
};
exports.isAuthenticated = isAuthenticated;
// Clear session data
const clearSession = (ctx) => {
    ctx.session = {};
};
exports.clearSession = clearSession;
// Save auth token
const saveAuthToken = (ctx, token) => {
    if (!ctx.session) {
        ctx.session = {};
    }
    ctx.session.token = token;
};
exports.saveAuthToken = saveAuthToken;
// Save organization ID
const saveOrganizationId = (ctx, orgId) => {
    if (!ctx.session) {
        ctx.session = {};
    }
    ctx.session.organizationId = orgId;
};
exports.saveOrganizationId = saveOrganizationId;
// Initialize transfer state
const initTransferState = (ctx, type) => {
    if (!ctx.session) {
        ctx.session = {};
    }
    ctx.session.transferState = {
        type,
        step: 'recipient'
    };
};
exports.initTransferState = initTransferState;
// Update transfer state
const updateTransferState = (ctx, update) => {
    if (!ctx.session) {
        ctx.session = {};
    }
    if (!ctx.session.transferState) {
        ctx.session.transferState = {};
    }
    ctx.session.transferState = Object.assign(Object.assign({}, ctx.session.transferState), update);
};
exports.updateTransferState = updateTransferState;
// Clear transfer state
const clearTransferState = (ctx) => {
    if (ctx.session) {
        ctx.session.transferState = undefined;
    }
};
exports.clearTransferState = clearTransferState;
// Save wallets data
const saveWallets = (ctx, wallets) => {
    if (!ctx.session) {
        ctx.session = {};
    }
    ctx.session.wallets = wallets;
};
exports.saveWallets = saveWallets;
