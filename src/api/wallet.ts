import { api } from './client'
import type { WalletBalance, VoucherResponse, LeaderboardEntry, EcoTransactionItem, BadgesResponse } from '@/types/api'

export const getWalletBalance  = () => api.get<WalletBalance>('/wallet/balance')
export const generateVoucher   = () => api.post<VoucherResponse>('/wallet/generate-voucher')
export const getLeaderboard    = () => api.get<LeaderboardEntry[]>('/wallet/leaderboard')
export const getTransactions   = () => api.get<EcoTransactionItem[]>('/wallet/transactions')
export const getBadges         = () => api.get<BadgesResponse>('/wallet/badges')
