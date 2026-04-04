"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { submitBid } from "@/lib/actions/bids";

interface ApplyFormProps {
  jobId: string;
  budgetMin?: number;
  budgetMax?: number;
}

export function ApplyForm({ jobId, budgetMin, budgetMax }: ApplyFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData(event.currentTarget);
    const amount = parseFloat(formData.get("amount") as string);
    const proposal = formData.get("proposal") as string;
    const deliveryDays = parseInt(formData.get("delivery_days") as string);

    startTransition(async () => {
      const result = await submitBid(jobId, amount, proposal, deliveryDays);
      if (result.error) {
        setError(result.error);
      } else if (result.success) {
        setSuccess(true);
        // Reset form if needed or redirect
      }
    });
  };

  if (success) {
    return (
      <div className="p-8 bg-[#151215] border border-[#f1bfff]/30 rounded-2xl text-center space-y-4">
        <span className="material-symbols-outlined text-5xl text-[#f1bfff]">check_circle</span>
        <h3 className="text-xl font-heading font-bold text-[#faf1f5]">Application Sent!</h3>
        <p className="text-[#b0a9ad]">Your proposal has been securelly transmitted to the employer.</p>
        <button 
          onClick={() => setSuccess(false)}
          className="text-[#f1bfff] font-bold underline"
        >
          Submit another application
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 bg-[#151215] border border-[#292428]/30 rounded-2xl shadow-inner relative group/form overflow-hidden transition-all duration-500 hover:border-[#f1bfff]/20">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/form:opacity-20 transition-opacity">
        <span className="material-symbols-outlined text-4xl text-[#f1bfff]">electric_bolt</span>
      </div>
      
      <h3 className="text-2xl font-heading font-bold text-[#faf1f5] mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-[#f1bfff]">edit_note</span>
        Quick Apply
      </h3>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-[#b0a9ad] uppercase tracking-widest pl-1">Your Proposal (Bid Amount)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f1bfff] font-bold font-body">$</span>
            <input 
              name="amount"
              type="number" 
              required
              step="0.01"
              defaultValue={budgetMin}
              className="w-full bg-[#100d10] border border-[#4b474a]/20 rounded-xl py-4 pl-10 pr-4 text-[#f1bfff] font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[#f1bfff]/30 transition-all placeholder:text-[#4b474a]/50" 
              placeholder="0.00" 
            />
          </div>
          {budgetMin && budgetMax && (
            <p className="text-xs text-[#b0a9ad] mt-1 italic pl-1">Suggested: ${budgetMin.toLocaleString()} – ${budgetMax.toLocaleString()}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-[#b0a9ad] uppercase tracking-widest pl-1">Delivery Time (Days)</label>
          <div className="relative">
             <input 
              name="delivery_days"
              type="number" 
              required
              min="1"
              className="w-full bg-[#100d10] border border-[#4b474a]/20 rounded-xl py-4 px-4 text-[#faf1f5] focus:outline-none focus:ring-2 focus:ring-[#f1bfff]/30 transition-all placeholder:text-[#4b474a]/50" 
              placeholder="Estimated time in days" 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-[#b0a9ad] uppercase tracking-widest pl-1">Elevator Pitch</label>
          <textarea 
            name="proposal"
            required
            className="w-full bg-[#100d10] border border-[#4b474a]/20 rounded-xl py-4 px-4 text-[#faf1f5] h-32 resize-none focus:outline-none focus:ring-2 focus:ring-[#f1bfff]/30 transition-all placeholder:text-[#4b474a]/50" 
            placeholder="Tell us why you're the absolute best for this elite role..."
          ></textarea>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}

        <button 
          type="submit"
          disabled={isPending}
          className="w-full bg-gradient-to-r from-[#caa2f7] to-[#f1bfff] text-[#100d10] font-black py-5 rounded-xl uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(202,162,247,0.3)] transition-all hover:shadow-[0_15px_40px_rgba(202,162,247,0.5)] hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group/btn overflow-hidden relative"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isPending ? 'Deploying Proposal...' : 'Transmit Proposal'}
            <span className="material-symbols-outlined group-hover/btn:translate-x-1 transition-transform">send</span>
          </span>
          <div className="absolute inset-0 bg-white opacity-0 group-hover/btn:opacity-10 transition-opacity"></div>
        </button>
      </form>
      
      <p className="text-center text-[10px] text-[#b0a9ad] uppercase tracking-widest mt-6 opacity-50">Secure end-to-end encrypted transmission</p>
    </div>
  );
}
