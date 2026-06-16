'use client'

interface Invoice {
  id: string
  date: string
  amount: string
  status: string
  pdfUrl: string | null
}

export default function DownloadLedgerButton({ invoices }: { invoices: Invoice[] }) {
  const handleDownload = () => {
    if (invoices.length === 0) return
    const headers = ['Invoice ID', 'Date', 'Amount', 'Status']
    const rows = invoices.map(inv => [inv.id, inv.date, `$${inv.amount}`, inv.status])
    const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${v}"`).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bidjobs_invoices_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleDownload}
      disabled={invoices.length === 0}
      className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary hover:underline underline-offset-8 disabled:opacity-40 disabled:cursor-not-allowed"
    >
      Download Protocol Ledger
    </button>
  )
}
