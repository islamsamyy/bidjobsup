'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle2, 
  XCircle, 
  User, 
  Calendar, 
  DollarSign, 
  Mail, 
  ArrowLeft, 
  Download, 
  MessageSquare 
} from 'lucide-react'
import Link from 'next/link'
import { updateBidStatus, withdrawBid } from '@/lib/actions/bids'
import { Toast } from '@/components/layout/Toast'

export default function ApplicantReviewClient({ job, bids }: { job: any, bids: any[] }) {
  const [activeBids, setActiveBids] = useState(bids)
  const [selectedBid, setSelectedBid] = useState<any | null>(null)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null)
  
  const handleStatusUpdate = async (bidId: string, status: 'pending' | 'accepted' | 'rejected' | 'interview') => {
    setIsUpdating(bidId)
    setToast(null)
    const res = await updateBidStatus(bidId, status)
    setIsUpdating(null)
    if (res.success) {
      setActiveBids(activeBids.map(b => b.id === bidId ? { ...b, status } : b))
      setToast({ message: `Bid status updated to ${status}. Notification dispatched.`, type: 'success' })
    } else {
      setToast({ message: "Update Error: " + res.error, type: 'error' })
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-6"
      >
        <Link href="/dashboard/employer/listings">
          <div className="w-12 h-12 rounded-full bg-surface-container border border-outline-variant/20 flex items-center justify-center hover:bg-surface-container-high hover:border-primary/50 transition-all text-stone-400 hover:text-on-surface">
            <ArrowLeft className="w-5 h-5" />
          </div>
        </Link>
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary block mb-2">Mission Candidates</span>
          <h1 className="text-4xl md:text-5xl font-headline font-black italic text-on-background">
            {job.title}
          </h1>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Candidates List */}
        <div className="col-span-1 border-r border-outline-variant/10 pr-4 h-[70vh] overflow-y-auto">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {activeBids.length === 0 ? (
               <div className="p-8 text-center border-dashed border-2 border-outline-variant/20 rounded-3xl">
                  <span className="material-symbols-outlined text-4xl text-stone-600 mb-4 block">scan</span>
                  <p className="text-sm text-stone-400 font-bold">No candidates found.</p>
               </div>
            ) : (
              activeBids.map(bid => (
                <motion.div 
                  key={bid.id}
                  variants={itemVariants}
                  onClick={() => setSelectedBid(bid)}
                  className={`p-6 rounded-2xl cursor-pointer transition-all border ${selectedBid?.id === bid.id ? 'bg-primary/5 border-primary/40 shadow-lg shadow-primary/5' : 'bg-surface-container border-outline-variant/10 hover:border-primary/20 hover:bg-surface-container-high'}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-headline font-bold text-lg text-on-surface">
                      {bid.users?.full_name || 'Classified Identity'}
                    </h3>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${
                      bid.status === 'accepted' ? 'bg-green-500/10 text-green-400' :
                      bid.status === 'rejected' ? 'bg-red-500/10 text-red-400' :
                      bid.status === 'interview' ? 'bg-secondary/10 text-secondary' :
                      'bg-stone-500/10 text-stone-400'
                    }`}>
                      {bid.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-bold text-stone-500 mt-2">
                    <span className="flex items-center gap-1.5"><DollarSign className="w-3.5 h-3.5" /> ${bid.amount}</span>
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {bid.delivery_days} days</span>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>

        {/* Detailed Review Panel */}
        <div className="col-span-1 lg:col-span-2">
          <AnimatePresence mode="wait">
            {!selectedBid ? (
               <motion.div 
                 key="empty"
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 className="h-full flex flex-col items-center justify-center p-20 border-dashed border-2 border-outline-variant/10 rounded-3xl"
               >
                  <User className="w-16 h-16 text-stone-600 mb-6 opacity-20" />
                  <p className="text-xl font-headline italic font-bold text-stone-500">Select a candidate to review their protocol.</p>
               </motion.div>
            ) : (
               <motion.div
                 key="selected"
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -20 }}
                 className="bg-surface-container rounded-3xl border border-outline-variant/10 p-10 shadow-2xl relative overflow-hidden group"
               >
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full group-hover:bg-primary/10 transition-colors pointer-events-none"></div>
                  
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
                    <div>
                      <h2 className="text-3xl font-black font-headline italic text-on-surface mb-2">
                        {selectedBid.users?.full_name || 'Anonymous Applicant'}
                      </h2>
                      <div className="flex items-center gap-2 text-sm text-stone-500">
                        <Mail className="w-4 h-4" />
                        {selectedBid.users?.email}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-surface-container-high px-6 py-4 rounded-xl border border-outline-variant/20 shadow-inner">
                      <div className="text-center px-4 border-r border-outline-variant/10">
                        <span className="text-[10px] uppercase font-black tracking-widest text-stone-500 block">Bid</span>
                        <span className="text-2xl font-black text-on-surface">${selectedBid.amount}</span>
                      </div>
                      <div className="text-center px-4">
                        <span className="text-[10px] uppercase font-black tracking-widest text-stone-500 block">ETA</span>
                        <span className="text-2xl font-black text-on-surface">{selectedBid.delivery_days}D</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 mb-12">
                    <h4 className="text-xs font-black uppercase tracking-widest text-stone-400 mb-6 flex items-center gap-2">
                      Proposal Protocol <Download className="w-4 h-4" />
                    </h4>
                    <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/10 prose prose-invert prose-p:text-on-surface-variant max-w-none shadow-inner">
                      <p className="whitespace-pre-wrap">{selectedBid.proposal}</p>
                    </div>
                  </div>

                  <div className="relative z-10 flex gap-4 mt-auto border-t border-outline-variant/10 pt-8">
                    {selectedBid.status === 'pending' && (
                      <div className="flex gap-2">
                        <button 
                          disabled={isUpdating === selectedBid.id}
                          onClick={() => handleStatusUpdate(selectedBid.id, 'accepted')}
                          className="bg-primary/20 text-primary hover:bg-primary/30 px-6 py-4 rounded-xl border border-primary/20 transition-all disabled:opacity-50 flex items-center gap-2 font-black uppercase tracking-widest"
                        >
                          <CheckCircle2 size={18} /> Accept
                        </button>
                        <button 
                          disabled={isUpdating === selectedBid.id}
                          onClick={() => handleStatusUpdate(selectedBid.id, 'interview')}
                          className="bg-secondary/20 text-secondary hover:bg-secondary/30 px-6 py-4 rounded-xl border border-secondary/20 transition-all disabled:opacity-50 flex items-center gap-2 font-black uppercase tracking-widest"
                        >
                          <MessageSquare size={18} /> Interview
                        </button>
                        <button 
                          disabled={isUpdating === selectedBid.id}
                          onClick={() => handleStatusUpdate(selectedBid.id, 'rejected')}
                          className="bg-red-500/20 text-red-500 hover:bg-red-500/30 px-6 py-4 rounded-xl border border-red-500/20 transition-all disabled:opacity-50 flex items-center gap-2 font-black uppercase tracking-widest"
                        >
                          <XCircle size={18} /> Reject
                        </button>
                      </div>
                    )}
                    
                    {selectedBid.status === 'interview' && (
                      <div className="flex gap-2">
                        <button 
                          disabled={isUpdating === selectedBid.id}
                          onClick={() => handleStatusUpdate(selectedBid.id, 'accepted')}
                          className="bg-primary/20 text-primary hover:bg-primary/30 px-6 py-4 rounded-xl border border-primary/20 transition-all disabled:opacity-50 flex items-center gap-2 font-black uppercase tracking-widest"
                        >
                          <CheckCircle2 size={18} /> Accept
                        </button>
                        <button 
                          disabled={isUpdating === selectedBid.id}
                          onClick={() => handleStatusUpdate(selectedBid.id, 'rejected')}
                          className="bg-red-500/20 text-red-500 hover:bg-red-500/30 px-6 py-4 rounded-xl border border-red-500/20 transition-all disabled:opacity-50 flex items-center gap-2 font-black uppercase tracking-widest"
                        >
                          <XCircle size={18} /> Reject
                        </button>
                      </div>
                    )}
                    <Link href={`/dashboard/messages?recipient=${selectedBid.users?.id}`} className="px-8 bg-surface-container-high text-on-surface py-4 rounded-xl font-black flex items-center justify-center border border-outline-variant/20 hover:border-primary/50 transition-colors">
                      <Mail className="w-5 h-5" />
                    </Link>
                  </div>
               </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      {/* UI Notifications */}
      <AnimatePresence>
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  )
}
