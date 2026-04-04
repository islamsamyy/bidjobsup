'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'info'
  onClose: () => void
}

export const Toast = ({ message, type, onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  const icons = {
    success: 'verified_user',
    error: 'report',
    info: 'info'
  }

  const colors = {
    success: 'bg-primary/10 border-primary/20 text-primary shadow-[0_0_20px_rgba(202,162,247,0.1)]',
    error: 'bg-red-500/10 border-red-500/20 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.1)]',
    info: 'bg-stone-500/10 border-stone-500/20 text-stone-500 shadow-[0_0_20px_rgba(120,113,108,0.1)]'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, x: 20 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className={`fixed bottom-8 right-8 z-[100] p-6 rounded-2xl border flex items-center gap-4 backdrop-blur-xl ${colors[type]}`}
    >
      <span className="material-symbols-outlined">{icons[type]}</span>
      <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed max-w-xs">
        {message}
      </p>
      <button 
        onClick={onClose}
        className="ml-2 text-stone-500 hover:text-white transition-colors"
      >
        <span className="material-symbols-outlined text-xs">close</span>
      </button>
    </motion.div>
  )
}

export const useToast = () => {
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type })
  }

  const closeToast = () => setToast(null)

  return { toast, showToast, closeToast }
}
