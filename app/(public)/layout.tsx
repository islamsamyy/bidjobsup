import PublicHeader from "@/components/layout/PublicHeader";
import PublicFooter from "@/components/layout/PublicFooter";
import { createClient } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', user.id)
      .single();
    profile = data;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#100d10] text-[#faf1f5] font-body">
      <PublicHeader initialUser={user} initialProfile={profile} />
      <main className="flex-grow pt-24">
        {children}
      </main>
      <PublicFooter />
    </div>
  );
}
