'use client'

import { useState } from 'react'
import { updateProfile } from './actions'

interface ProfileFormProps {
  initialData: {
    full_name: string
    username: string
    bio: string
    portfolio_url: string
    avatar_url: string
    location: string
    skills: string[]
    hourly_rate: number | null
    [key: string]: any
  }
}

export default function ProfileForm({ initialData }: ProfileFormProps) {
  const [formData, setFormData] = useState(initialData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    const result = await updateProfile(formData)

    if (result?.success) {
      setMessage({ type: 'success', text: 'Identity Profile Updated Successfully' })
    } else {
      setMessage({ type: 'error', text: result?.error || 'Failed to sync protocol' })
    }
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {message && (
        <div className={`p-6 rounded-2xl border flex items-center gap-4 ${
          message.type === 'success' 
            ? 'bg-primary/10 border-primary/20 text-primary shadow-[0_0_20px_rgba(202,162,247,0.1)]' 
            : 'bg-error/10 border-error/20 text-error'
        }`}>
          <span className="material-symbols-outlined">{message.type === 'success' ? 'verified' : 'report'}</span>
          <p className="text-xs font-black uppercase tracking-widest">{message.text}</p>
        </div>
      )}

      {/* Grid Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        
        {/* Identity Core */}
        <div className="space-y-6">
          <h3 className="serif-display text-2xl italic flex items-center gap-3">
            <span className="w-8 h-px bg-primary/40"></span>
            Identity Core
          </h3>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 px-1">Full Legal Name</label>
            <input 
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="w-full bg-surface-container border border-outline-variant/10 rounded-xl px-6 py-4 text-on-surface focus:outline-none focus:border-primary/50 transition-all font-bold placeholder:text-stone-700"
              placeholder="e.g. Khalid Al-Saud"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 px-1">Global Alias</label>
            <input 
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full bg-surface-container border border-outline-variant/10 rounded-xl px-6 py-4 text-on-surface focus:outline-none focus:border-primary/50 transition-all font-bold placeholder:text-stone-700"
              placeholder="e.g. ksa_creative"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 px-1">Node Location</label>
            <input 
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full bg-surface-container border border-outline-variant/10 rounded-xl px-6 py-4 text-on-surface focus:outline-none focus:border-primary/50 transition-all font-bold placeholder:text-stone-700"
              placeholder="e.g. Riyadh, Saudi Arabia"
            />
          </div>
        </div>

        {/* Digital Presence */}
        {/* Digital Presence & Avatar */}
        <div className="space-y-6">
          <h3 className="serif-display text-2xl italic flex items-center gap-3">
            <span className="w-8 h-px bg-secondary/40"></span>
            Presence & Credentials
          </h3>

          <div className="flex gap-6 items-center">
             <div className="w-20 h-20 rounded-2xl border-2 border-outline-variant/20 bg-surface-container-high overflow-hidden flex-shrink-0 flex items-center justify-center relative group">
                {formData.avatar_url ? (
                  <img src={formData.avatar_url} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-3xl text-stone-600">person</span>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  </div>
                )}
             </div>
             <div className="space-y-4 flex-grow">
               <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 px-1">Identity Portrait (Avatar)</label>
               <div className="flex gap-4">
                 <input 
                   type="file"
                   id="avatar-upload"
                   accept="image/*"
                   className="hidden"
                   onChange={async (e) => {
                     const file = e.target.files?.[0]
                     if (!file) return
                     
                     setIsUploading(true)
                     const { createClient } = await import('@/lib/supabase/client')
                     const supabase = createClient()
                     
                     const fileName = `${Date.now()}-${file.name}`
                     const { data, error } = await supabase.storage
                       .from('avatars')
                       .upload(fileName, file)
                     
                     if (error) {
                       setMessage({ type: 'error', text: 'Upload Failed: ' + error.message })
                     } else {
                       const { data: { publicUrl } } = supabase.storage
                         .from('avatars')
                         .getPublicUrl(data.path)
                       setFormData(prev => ({ ...prev, avatar_url: publicUrl }))
                       setMessage({ type: 'success', text: 'Aesthetic Identity Captured' })
                     }
                     setIsUploading(false)
                   }}
                 />
                 <label 
                   htmlFor="avatar-upload"
                   className="flex-grow flex items-center justify-center h-14 bg-surface-container border border-dashed border-outline-variant/30 rounded-xl cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group"
                 >
                   <span className="material-symbols-outlined text-stone-600 group-hover:text-primary transition-colors">cloud_upload</span>
                 </label>
                 
                 {formData.avatar_url && (
                   <button 
                     type="button"
                     onClick={() => setFormData(prev => ({ ...prev, avatar_url: '' }))}
                     className="w-14 h-14 flex items-center justify-center bg-surface-container border border-outline-variant/10 rounded-xl hover:bg-error/10 hover:text-error transition-all"
                   >
                     <span className="material-symbols-outlined">delete</span>
                   </button>
                 )}
               </div>
             </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 px-1">Portfolio Link</label>
            <input 
              name="portfolio_url"
              value={formData.portfolio_url}
              onChange={handleChange}
              className="w-full bg-surface-container border border-outline-variant/10 rounded-xl px-6 py-4 text-on-surface focus:outline-none focus:border-primary/50 transition-all font-bold placeholder:text-stone-700"
              placeholder="https://khalid.design"
            />
          </div>

          {(initialData.user_type === 'jobseeker' || initialData.user_type === 'seeker') && (
            <>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 px-1">Hourly Rate ($)</label>
                   <input 
                     name="hourly_rate"
                     type="number"
                     value={formData.hourly_rate || ''}
                     onChange={handleChange}
                     className="w-full bg-surface-container border border-outline-variant/10 rounded-xl px-6 py-4 text-on-surface focus:outline-none focus:border-primary/50 transition-all font-bold placeholder:text-stone-700"
                     placeholder="e.g. 150"
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 px-1">Experience Level</label>
                   <select 
                     name="experience_level"
                     value={formData.experience_level || ''}
                     onChange={(e: any) => handleChange(e)}
                     className="w-full bg-surface-container border border-outline-variant/10 rounded-xl px-4 py-4 text-on-surface focus:outline-none focus:border-primary/50 transition-all font-bold appearance-none"
                   >
                     <option value="">Select Level</option>
                     <option value="junior">Junior</option>
                     <option value="mid">Mid-Level</option>
                     <option value="senior">Senior</option>
                     <option value="expert">Expert</option>
                   </select>
                 </div>
              </div>
              <div className="space-y-2 mt-4">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 px-1">Expertise Cluster (Skills - Comma Separated)</label>
                <input 
                  name="skills"
                  value={Array.isArray(formData.skills) ? formData.skills.join(', ') : formData.skills || ''}
                  onChange={(e) => {
                    const skills = e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                    setFormData(prev => ({ ...prev, skills }))
                  }}
                  className="w-full bg-surface-container border border-outline-variant/10 rounded-xl px-6 py-4 text-on-surface focus:outline-none focus:border-primary/50 transition-all font-bold placeholder:text-stone-700"
                  placeholder="e.g. Next.js, AI Architecture, Shadcn"
                />
              </div>
            </>
          )}

          {initialData.user_type === 'employer' && (
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 px-1">Company Name</label>
                 <input 
                   name="company_name"
                   value={formData.company_name || ''}
                   onChange={handleChange}
                   className="w-full bg-surface-container border border-outline-variant/10 rounded-xl px-6 py-4 text-on-surface focus:outline-none focus:border-primary/50 transition-all font-bold placeholder:text-stone-700"
                   placeholder="e.g. Acme Corp"
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 px-1">Industry</label>
                 <input 
                   name="industry"
                   value={formData.industry || ''}
                   onChange={handleChange}
                   className="w-full bg-surface-container border border-outline-variant/10 rounded-xl px-6 py-4 text-on-surface focus:outline-none focus:border-primary/50 transition-all font-bold placeholder:text-stone-700"
                   placeholder="e.g. Technology"
                 />
               </div>
            </div>
          )}
        </div>

        {/* Biography Full Width */}
        <div className="md:col-span-2 space-y-6 pt-6">
          <h3 className="serif-display text-2xl italic flex items-center gap-3">
            <span className="w-8 h-px bg-stone-700"></span>
            The Vision Dossier
          </h3>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-500 px-1">Mission Narrative (Bio)</label>
            <textarea 
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={5}
              className="w-full bg-surface-container border border-outline-variant/10 rounded-2xl px-8 py-6 text-on-surface-variant focus:outline-none focus:border-primary/50 transition-all font-body text-sm leading-relaxed resize-none"
              placeholder="Describe your strategic approach and unique tactical advantages in the creative market..."
            />
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-12 border-t border-outline-variant/10 flex justify-between items-center">
        <div className="text-[10px] text-stone-600 font-bold uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Connected to Secure Cluster
        </div>
        
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-primary text-on-primary px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-[0_10px_40px_rgba(202,162,247,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-4"
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></span>
              Syncing...
            </>
          ) : (
            <>
              Update Protocol
              <span className="material-symbols-outlined text-sm">sync_alt</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}
