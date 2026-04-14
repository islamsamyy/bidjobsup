'use client'

import { useState } from 'react'
import { useLanguage } from '@/app/providers/LanguageProvider'
import Link from 'next/link'

interface Payment {
  id: number
  amount: number
  currency: string
  status: string
  payment_method: string
  description?: string
  created_at: string
  completed_at?: string
  payer_id: number
  payee_id: number
  payer?: { id: number; full_name: string; avatar_url?: string }
  payee?: { id: number; full_name: string; avatar_url?: string }
}

interface Invoice {
  id: number
  invoice_number: string
  amount: number
  currency: string
  status: string
  issue_date: string
  due_date: string
  created_at: string
  from_user_id: number
  to_user_id: number
  from_user?: { id: number; full_name: string; avatar_url?: string }
  to_user?: { id: number; full_name: string; avatar_url?: string }
}

interface PaymentHistoryClientProps {
  payments: Payment[]
  invoices?: Invoice[]
  currentUserId: number
}

export default function PaymentHistoryClient({
  payments: initialPayments,
  invoices: initialInvoices = [],
  currentUserId,
}: PaymentHistoryClientProps) {
  const { t, dir } = useLanguage()
  const [activeTab, setActiveTab] = useState<'all' | 'sent' | 'received' | 'invoices'>('all')
  const [filterStatus, setFilterStatus] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30'
      case 'processing':
        return 'bg-blue-500/10 text-blue-300 border-blue-500/30'
      case 'failed':
        return 'bg-red-500/10 text-red-300 border-red-500/30'
      case 'refunded':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30'
      default:
        return 'bg-outline-variant/10 text-on-surface border-outline-variant/30'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return 'check_circle'
      case 'pending':
        return 'schedule'
      case 'processing':
        return 'hourglass_bottom'
      case 'failed':
        return 'cancel'
      case 'refunded':
        return 'undo'
      default:
        return 'info'
    }
  }

  // Filter payments based on tab
  let filteredItems: (Payment | Invoice)[] = []

  if (activeTab === 'sent') {
    filteredItems = initialPayments.filter(p => p.payer_id === currentUserId)
  } else if (activeTab === 'received') {
    filteredItems = initialPayments.filter(p => p.payee_id === currentUserId)
  } else if (activeTab === 'invoices') {
    filteredItems = initialInvoices
  } else {
    filteredItems = [...initialPayments, ...initialInvoices]
  }

  // Apply status filter
  if (filterStatus) {
    filteredItems = filteredItems.filter(item => item.status === filterStatus)
  }

  // Sort by date
  filteredItems = filteredItems.sort((a, b) => {
    const dateA = new Date(a.created_at).getTime()
    const dateB = new Date(b.created_at).getTime()
    return dateB - dateA
  })

  const isPayment = (item: any): item is Payment => {
    return 'payer_id' in item
  }

  return (
    <div dir={dir} className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-outline-variant/20">
        {[
          { value: 'all', label: 'All Transactions' },
          { value: 'sent', label: 'Sent' },
          { value: 'received', label: 'Received' },
          { value: 'invoices', label: 'Invoices' },
        ].map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value as any)}
            className={`px-4 py-3 text-sm uppercase tracking-widest font-semibold transition-all border-b-2 ${
              activeTab === tab.value
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="glass border border-outline-variant/15 rounded-xl p-6">
        <p className="text-xs uppercase tracking-widest text-on-surface-variant font-semibold mb-3">Filter</p>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilterStatus(null)}
            className={`px-4 py-2 rounded-lg text-xs uppercase tracking-widest font-semibold transition-all ${
              filterStatus === null
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container hover:bg-surface-bright text-on-surface'
            }`}
          >
            All
          </button>
          {['completed', 'pending', 'processing', 'failed'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-xs uppercase tracking-widest font-semibold transition-all ${
                filterStatus === status
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container hover:bg-surface-bright text-on-surface'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {filteredItems.map(item => {
          if (isPayment(item)) {
            const isOutgoing = item.payer_id === currentUserId
            const otherParty = isOutgoing ? item.payee : item.payer
            return (
              <div
                key={`payment-${item.id}`}
                className="glass border border-outline-variant/15 rounded-xl p-6 hover:border-outline-variant/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getStatusColor(item.status)}`}>
                      <span className="material-symbols-outlined">{getStatusIcon(item.status)}</span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-semibold text-on-surface">
                          {isOutgoing ? 'Paid to' : 'Received from'} {otherParty?.full_name}
                        </p>
                        <span className={`px-2 py-1 rounded text-xs font-semibold border ${getStatusColor(item.status)}`}>
                          {item.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-on-surface-variant text-sm mb-2">
                        {item.description || 'Payment'}
                      </p>
                      <p className="text-on-surface-variant text-xs">
                        {formatDate(item.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className={`text-2xl font-bold ${isOutgoing ? 'text-error' : 'text-emerald-400'}`}>
                      {isOutgoing ? '-' : '+'}${item.amount.toFixed(2)}
                    </div>
                    <p className="text-on-surface-variant text-xs mt-2">
                      {item.currency}
                    </p>
                  </div>
                </div>
              </div>
            )
          } else {
            const isOutgoing = item.from_user_id === currentUserId
            const otherParty = isOutgoing ? item.to_user : item.from_user
            return (
              <div
                key={`invoice-${item.id}`}
                className="glass border border-outline-variant/15 rounded-xl p-6 hover:border-outline-variant/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getStatusColor(item.status)}`}>
                      <span className="material-symbols-outlined">{getStatusIcon(item.status)}</span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-semibold text-on-surface">
                          {isOutgoing ? 'Invoice to' : 'Invoice from'} {otherParty?.full_name}
                        </p>
                        <span className={`px-2 py-1 rounded text-xs font-semibold border ${getStatusColor(item.status)}`}>
                          {item.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-on-surface-variant text-xs">
                        Invoice #{item.invoice_number} • Issued {formatDate(item.issue_date)} • Due {formatDate(item.due_date)}
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-2xl font-bold text-on-surface">
                      ${item.amount.toFixed(2)}
                    </div>
                    <p className="text-on-surface-variant text-xs mt-2">
                      {item.currency}
                    </p>
                  </div>
                </div>
              </div>
            )
          }
        })}
      </div>

      {/* No Results */}
      {filteredItems.length === 0 && (
        <div className="glass border border-outline-variant/15 rounded-xl p-12 text-center">
          <p className="text-on-surface-variant">
            {filterStatus ? 'No transactions found with the selected filter.' : 'No transactions in this category.'}
          </p>
        </div>
      )}
    </div>
  )
}
