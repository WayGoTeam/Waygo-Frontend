import { api } from './client'
import type { WalletBalance, VoucherResponse } from '@/types/api'

export const getWalletBalance = () => api.get<WalletBalance>('/wallet/balance')

export const generateVoucher = () => api.post<VoucherResponse>('/wallet/generate-voucher')
