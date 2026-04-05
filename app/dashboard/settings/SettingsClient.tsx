'use client'

import { useState } from 'react'
import { changePassword, changeEmail, updateNotificationPrefs, updatePrivacySettings, deleteAccount } from './actions'

interface Profile {
  full_name: string
  email: string
  user_type: string
  notification_prefs?: {
    email_new_bid?: boolean
    email_bid_status?: boolean
    email_new_message?: boolean
    email_weekly_digest?: boolean
  }
  privacy_settings?: {
    profile_visible?: boolean
    show_hourly_rate?: boolean
    show_location?: boolean
  }
}

function Toast({ msg, type }: { msg: string; type: 'success' | 'error' }) {
  return (
    <div className={`flex items-center gap-3 p-4 rounded-2xl border text-xs font-black uppercase tracking-widest
      ${type === 'success'
        ? 'bg-primary/10 border-primary/20 text-primary'
        : 'bg-error/10 border-error/20 text-error'
      }`}
    >
      <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
        {type === 'success' ? 'check_circle' : 'report'}
      </span>
      {msg}
    </div>
  )
}

function SectionCard({ title, subtitle, icon, color = 'primary', children }: {
  title: string
  subtitle: string
  icon: string
  color?: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-surface-container rounded-[2rem] border border-outline-variant/10 overflow-hidden">
      <div className="px-10 py-8 border-b border-outline-variant/10 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl bg-${color}/10 flex items-center justify-center`}>
          <span className={`material-symbols-outlined text-xl text-${color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
        </div>
        <div>
          <h2 className="font-headline text-xl font-black italic text-on-surface">{title}</h2>
          <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold mt-0.5">{subtitle}</p>
        </div>
      </div>
      <div className="px-10 py-8">{children}</div>
    </div>
  )
}

function Toggle({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-6 py-4 border-b border-outline-variant/5 last:border-0">
      <div>
        <p className="text-sm font-bold text-on-surface">{label}</p>
        <p className="text-[11px] text-on-surface-variant mt-0.5">{desc}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-6 rounded-full transition-colors duration-200 shrink-0
          ${checked ? 'bg-primary' : 'bg-stone-700'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200
          ${checked ? 'translate-x-6' : 'translate-x-0'}`}
        />
      </button>
    </div>
  )
}

export default function SettingsClient({ profile, email }: { profile: Profile; email: string }) {
  // ── Password ─────────────────────────────────────
  const [pwForm, setPwForm] = useState({ current: '', new: '', confirm: '' })
  const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [pwLoading, setPwLoading] = useState(false)

  // ── Email ─────────────────────────────────────────
  const [newEmail, setNewEmail] = useState('')
  const [emailMsg, setEmailMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [emailLoading, setEmailLoading] = useState(false)

  // ── Notifications ─────────────────────────────────
  const [notifPrefs, setNotifPrefs] = useState({
    email_new_bid: profile.notification_prefs?.email_new_bid ?? true,
    email_bid_status: profile.notification_prefs?.email_bid_status ?? true,
    email_new_message: profile.notification_prefs?.email_new_message ?? true,
    email_weekly_digest: profile.notification_prefs?.email_weekly_digest ?? false,
  })
  const [notifMsg, setNotifMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [notifLoading, setNotifLoading] = useState(false)

  // ── Privacy ───────────────────────────────────────
  const [privacy, setPrivacy] = useState({
    profile_visible: profile.privacy_settings?.profile_visible ?? true,
    show_hourly_rate: profile.privacy_settings?.show_hourly_rate ?? true,
    show_location: profile.privacy_settings?.show_location ?? true,
  })
  const [privacyMsg, setPrivacyMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [privacyLoading, setPrivacyLoading] = useState(false)

  // ── Danger zone ───────────────────────────────────
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deleteMsg, setDeleteMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [showDeleteZone, setShowDeleteZone] = useState(false)

  /* handlers ──────────────────────────────────────── */
  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (pwForm.new !== pwForm.confirm) {
      setPwMsg({ type: 'error', text: 'Passwords do not match.' })
      return
    }
    setPwLoading(true)
    const res = await changePassword(pwForm.current, pwForm.new)
    setPwMsg(res.success
      ? { type: 'success', text: 'Password updated successfully.' }
      : { type: 'error', text: res.error! })
    if (res.success) setPwForm({ current: '', new: '', confirm: '' })
    setPwLoading(false)
  }

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailLoading(true)
    const res = await changeEmail(newEmail)
    setEmailMsg(res.success
      ? { type: 'success', text: res.message || 'Verification email sent.' }
      : { type: 'error', text: res.error! })
    if (res.success) setNewEmail('')
    setEmailLoading(false)
  }

  const handleNotifSave = async () => {
    setNotifLoading(true)
    const res = await updateNotificationPrefs(notifPrefs)
    setNotifMsg(res.success
      ? { type: 'success', text: 'Notification preferences saved.' }
      : { type: 'error', text: res.error! })
    setNotifLoading(false)
  }

  const handlePrivacySave = async () => {
    setPrivacyLoading(true)
    const res = await updatePrivacySettings(privacy)
    setPrivacyMsg(res.success
      ? { type: 'success', text: 'Privacy settings updated.' }
      : { type: 'error', text: res.error! })
    setPrivacyLoading(false)
  }

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault()
    setDeleteLoading(true)
    const res = await deleteAccount(deleteConfirm)
    if (res?.error) {
      setDeleteMsg({ type: 'error', text: res.error })
      setDeleteLoading(false)
    }
    // on success, server redirects — no need to do anything
  }

  /* input style */
  const input = 'w-full bg-surface-container-high border border-outline-variant/10 rounded-xl px-5 py-3.5 text-on-surface text-sm font-medium focus:outline-none focus:border-primary/50 transition-all placeholder:text-stone-600'

  return (
    <div className="space-y-8">

      {/* ── Account ── */}
      <SectionCard title="Account Security" subtitle="Credentials & authentication" icon="shield_person">
        {/* Change Email */}
        <form onSubmit={handleEmail} className="space-y-4 pb-8 mb-8 border-b border-outline-variant/10">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Change Email Address</h3>
          <p className="text-[11px] text-stone-500">Current: <span className="text-on-surface font-bold">{email}</span></p>
          {emailMsg && <Toast msg={emailMsg.text} type={emailMsg.type} />}
          <input
            type="email"
            value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
            placeholder="New email address"
            className={input}
            required
          />
          <button
            type="submit"
            disabled={emailLoading}
            className="bg-surface-container-highest border border-outline-variant/10 text-on-surface px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-stone-800 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {emailLoading && <span className="w-3.5 h-3.5 border-2 border-on-surface/20 border-t-on-surface rounded-full animate-spin" />}
            Update Email
          </button>
        </form>

        {/* Change Password */}
        <form onSubmit={handlePassword} className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Change Password</h3>
          {pwMsg && <Toast msg={pwMsg.text} type={pwMsg.type} />}
          <input
            type="password"
            value={pwForm.current}
            onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))}
            placeholder="Current password"
            className={input}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="password"
              value={pwForm.new}
              onChange={e => setPwForm(p => ({ ...p, new: e.target.value }))}
              placeholder="New password (8+ chars)"
              className={input}
              required
            />
            <input
              type="password"
              value={pwForm.confirm}
              onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))}
              placeholder="Confirm new password"
              className={input}
              required
            />
          </div>
          <button
            type="submit"
            disabled={pwLoading}
            className="bg-primary text-on-primary px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-[0_8px_24px_rgba(202,162,247,0.15)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {pwLoading && <span className="w-3.5 h-3.5 border-2 border-on-primary/20 border-t-on-primary rounded-full animate-spin" />}
            Update Password
          </button>
        </form>
      </SectionCard>

      {/* ── Notifications ── */}
      <SectionCard title="Notification Preferences" subtitle="Control what emails you receive" icon="notifications" color="secondary">
        {notifMsg && <div className="mb-6"><Toast msg={notifMsg.text} type={notifMsg.type} /></div>}
        <div className="space-y-0">
          <Toggle
            label="New Bid Received"
            desc="Email when someone submits a bid on your job"
            checked={notifPrefs.email_new_bid}
            onChange={v => setNotifPrefs(p => ({ ...p, email_new_bid: v }))}
          />
          <Toggle
            label="Bid Status Updated"
            desc="Email when your bid is accepted, rejected, or moved to interview"
            checked={notifPrefs.email_bid_status}
            onChange={v => setNotifPrefs(p => ({ ...p, email_bid_status: v }))}
          />
          <Toggle
            label="New Message"
            desc="Email when you receive a new direct message"
            checked={notifPrefs.email_new_message}
            onChange={v => setNotifPrefs(p => ({ ...p, email_new_message: v }))}
          />
          <Toggle
            label="Weekly Digest"
            desc="A weekly summary of new roles matching your profile"
            checked={notifPrefs.email_weekly_digest}
            onChange={v => setNotifPrefs(p => ({ ...p, email_weekly_digest: v }))}
          />
        </div>
        <div className="mt-8">
          <button
            onClick={handleNotifSave}
            disabled={notifLoading}
            className="bg-secondary/10 border border-secondary/20 text-secondary px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-secondary/20 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {notifLoading && <span className="w-3.5 h-3.5 border-2 border-secondary/20 border-t-secondary rounded-full animate-spin" />}
            Save Preferences
          </button>
        </div>
      </SectionCard>

      {/* ── Privacy ── */}
      <SectionCard title="Privacy & Visibility" subtitle="Control who sees your information" icon="lock" color="tertiary">
        {privacyMsg && <div className="mb-6"><Toast msg={privacyMsg.text} type={privacyMsg.type} /></div>}
        <div className="space-y-0">
          <Toggle
            label="Public Profile"
            desc="Allow employers and seekers to view your profile"
            checked={privacy.profile_visible}
            onChange={v => setPrivacy(p => ({ ...p, profile_visible: v }))}
          />
          <Toggle
            label="Show Hourly Rate"
            desc="Display your hourly rate on your public profile"
            checked={privacy.show_hourly_rate}
            onChange={v => setPrivacy(p => ({ ...p, show_hourly_rate: v }))}
          />
          <Toggle
            label="Show Location"
            desc="Display your location on your public profile"
            checked={privacy.show_location}
            onChange={v => setPrivacy(p => ({ ...p, show_location: v }))}
          />
        </div>
        <div className="mt-8">
          <button
            onClick={handlePrivacySave}
            disabled={privacyLoading}
            className="bg-tertiary/10 border border-tertiary/20 text-tertiary px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-tertiary/20 transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {privacyLoading && <span className="w-3.5 h-3.5 border-2 border-tertiary/20 border-t-tertiary rounded-full animate-spin" />}
            Save Settings
          </button>
        </div>
      </SectionCard>

      {/* ── Danger Zone ── */}
      <SectionCard title="Danger Zone" subtitle="Irreversible account actions" icon="warning" color="error">
        {!showDeleteZone ? (
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-sm font-bold text-on-surface">Delete Account</p>
              <p className="text-[11px] text-on-surface-variant mt-1">
                Permanently delete your account and all associated data. This cannot be undone.
              </p>
            </div>
            <button
              onClick={() => setShowDeleteZone(true)}
              className="shrink-0 border border-error/30 text-error bg-error/5 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-error/10 transition-all"
            >
              Delete Account
            </button>
          </div>
        ) : (
          <form onSubmit={handleDelete} className="space-y-5">
            <div className="p-5 bg-error/5 border border-error/20 rounded-2xl space-y-2">
              <p className="text-xs font-black uppercase tracking-widest text-error flex items-center gap-2">
                <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                This action is permanent and cannot be reversed.
              </p>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                All your data including profile, bids, messages, and saved items will be deleted immediately.
              </p>
            </div>
            {deleteMsg && <Toast msg={deleteMsg.text} type={deleteMsg.type} />}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500">
                Type <span className="text-error">DELETE</span> to confirm
              </label>
              <input
                type="text"
                value={deleteConfirm}
                onChange={e => setDeleteConfirm(e.target.value)}
                placeholder="DELETE"
                className={`${input} border-error/20 focus:border-error/50`}
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={deleteLoading || deleteConfirm !== 'DELETE'}
                className="bg-error text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-error/80 transition-all disabled:opacity-40 flex items-center gap-2"
              >
                {deleteLoading && <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
                Permanently Delete
              </button>
              <button
                type="button"
                onClick={() => { setShowDeleteZone(false); setDeleteConfirm(''); setDeleteMsg(null) }}
                className="border border-outline-variant/10 text-on-surface-variant px-8 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-surface-container-high transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </SectionCard>
    </div>
  )
}
