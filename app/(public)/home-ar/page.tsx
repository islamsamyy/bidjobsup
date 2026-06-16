import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function ArabicLandingPage() {
  const supabase = await createClient();
  const { data: featuredJobs } = await supabase
    .from("jobs")
    .select("id, title, location, budget_min, budget_max, employer:employer_id(company_name, full_name)")
    .eq("status", "open")
    .order("created_at", { ascending: false })
    .limit(3);
  return (
    <div dir="rtl" className="font-body text-[#faf1f5] bg-[#100d10] min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        {/* Animated Glow Background */}
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-[#caa2f7]/5 rounded-full blur-[120px] -z-10 animate-pulse-glow"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-[#eab3fa]/5 rounded-full blur-[100px] -z-10"></div>

        <div className="max-w-screen-2xl mx-auto px-8 grid lg:grid-cols-2 gap-16 items-center text-right">
          <div className="relative z-10 space-y-10 animate-fade-in order-2 lg:order-1">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#613471]/30 border border-[#caa2f7]/20 text-[#f1bfff] text-[10px] font-bold tracking-[0.2em] uppercase">
              تمكين رؤية السعودية 2030
            </span>
            
            <h1 className="font-headline text-6xl md:text-8xl font-black leading-[0.95] tracking-tighter mb-8 bg-gradient-to-br from-[#faf1f5] to-[#b0a9ad] bg-clip-text text-transparent">
              ابنِ مستقبلك.<br />
              <span className="text-[#caa2f7] italic font-light drop-shadow-[0_0_20px_rgba(202,162,247,0.3)]">
                شكل العالم.
              </span>
            </h1>
            
            <p className="text-xl text-[#b0a9ad] max-w-xl leading-relaxed font-light">
              تواصل مع أرقى المنظمات في المملكة العربية السعودية. من عجائب نيوم المعمارية إلى آفاق STC الرقمية، تبدأ مسيرتك المهنية النخبوية من هنا.
            </p>

            {/* High-Fidelity Search Module */}
            <form action="/jobs/browse" method="GET" className="p-2.5 rounded-2xl bg-[#1c181c]/50 backdrop-blur-xl border border-[#4b474a]/20 shadow-2xl flex flex-col md:flex-row gap-3 max-w-3xl group hover:border-[#caa2f7]/20 transition-all duration-300">
              <div className="flex-1 flex items-center gap-4 px-5 py-4 bg-[#100d10] border border-[#292428] rounded-xl focus-within:border-[#caa2f7]/50 focus-within:shadow-[0_0_15px_rgba(202,162,247,0.1)] transition-all">
                <span className="material-symbols-outlined text-[#caa2f7] text-2xl">work</span>
                <input
                  name="q"
                  className="bg-transparent border-none text-[#faf1f5] focus:ring-0 w-full placeholder:text-[#4b474a] text-sm font-medium text-right"
                  placeholder="مسمى الوظيفة، المهارات أو الشركة"
                  type="text"
                />
              </div>
              <div className="flex-1 flex items-center gap-4 px-5 py-4 bg-[#100d10] border border-[#292428] rounded-xl focus-within:border-[#caa2f7]/50 focus-within:shadow-[0_0_15px_rgba(202,162,247,0.1)] transition-all">
                <span className="material-symbols-outlined text-[#caa2f7] text-2xl">location_on</span>
                <input
                  name="l"
                  className="bg-transparent border-none text-[#faf1f5] focus:ring-0 w-full placeholder:text-[#4b474a] text-sm font-medium text-right"
                  placeholder="الرياض، نيوم، جدة"
                  type="text"
                />
              </div>
              <button type="submit" className="bg-[#caa2f7] hover:bg-[#bc95e9] text-[#431f6b] font-black px-10 py-4 rounded-xl shadow-[0_4px_20px_rgba(202,162,247,0.3)] hover:scale-[0.98] transition-all duration-200 uppercase tracking-widest text-xs">
                بحث
              </button>
            </form>
          </div>

          <div className="relative group perspective-1000 order-1 lg:order-2">
            <div className="absolute -top-12 -left-12 w-64 h-64 bg-[#caa2f7]/10 rounded-full blur-[80px] group-hover:bg-[#caa2f7]/20 transition-colors duration-700"></div>
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden border border-[#caa2f7]/10 shadow-[0_40px_100px_rgba(0,0,0,0.6)] group-hover:rotate-0 transition-transform duration-700 hover:scale-[1.02] cursor-pointer">
              <img 
                alt="Elite Workspace" 
                className="w-full h-[650px] object-cover grayscale hover:grayscale-0 transition-all duration-700" 
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=2070"
              />
              
              {/* Floating Card UI */}
              <div className="absolute bottom-12 right-12 z-20 p-8 bg-[#100d10]/80 backdrop-blur-2xl rounded-2xl shadow-[0_32px_64px_rgba(0,0,0,0.5)] border border-[#caa2f7]/20 max-w-[280px] group-hover:-translate-x-4 transition-transform duration-500 text-right">
                <div className="flex items-center gap-5 justify-end mb-6">
                  <div>
                    <p className="text-[10px] text-[#b0a9ad] uppercase tracking-widest font-bold">المشاريع النشطة</p>
                    <p className="font-headline font-bold text-[#faf1f5] text-lg leading-tight">رابط نيوم فائق السرعة</p>
                  </div>
                  <div className="w-14 h-14 rounded-full bg-[#613471] flex items-center justify-center shadow-[0_0_15px_rgba(202,162,247,0.2)] flex-shrink-0">
                    <span className="material-symbols-outlined text-[#caa2f7] text-3xl">trending_up</span>
                  </div>
                </div>
                <div className="flex justify-end -space-x-reverse space-x-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full border-2 border-[#100d10] bg-[#caa2f7] text-[10px] font-black text-[#431f6b]">12k+</div>
                  {[['A','#613471'],['S','#4a2060'],['M','#7c3aed']].map(([letter, bg]) => (
                    <div key={letter} className="w-10 h-10 rounded-full border-2 border-[#100d10] overflow-hidden flex items-center justify-center text-[10px] font-black text-white" style={{ backgroundColor: bg }}>
                      {letter}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-20 bg-[#151215] border-y border-[#292428]/30">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-16 text-center">
            {[
              { label: "وظيفة نشطة", val: "+10,000" },
              { label: "شركة شريكة", val: "+500" },
              { label: "باحث عن عمل", val: "2.4M+" },
              { label: "معدل التوظيف", val: "92%" }
            ].map((stat) => (
              <div key={stat.label} className="group">
                <h3 className="font-headline text-5xl font-black text-[#caa2f7] mb-3 group-hover:scale-110 transition-transform tracking-tight">
                  {stat.val}
                </h3>
                <p className="text-[#b0a9ad] font-bold text-[10px] uppercase tracking-[0.2em]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-32">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8 text-right w-full">
            <Link href="/jobs/browse" className="text-[#caa2f7] font-bold text-sm tracking-widest uppercase flex items-center gap-3 hover:gap-6 transition-all group order-2 md:order-1">
              <span className="material-symbols-outlined text-xl transition-transform group-hover:-translate-x-1 rotate-180">arrow_right_alt</span>
              عرض جميع القطاعات
            </Link>
            <div className="space-y-4 order-1 md:order-2">
              <h2 className="font-headline text-5xl font-bold tracking-tight">تصفح حسب القطاع</h2>
              <p className="text-[#b0a9ad] text-lg font-light max-w-xl">فرص منسقة عبر القطاعات المزدهرة في المملكة.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "التصميم", desc: "المنتجات، تجربة المستخدم، والإدارة الإبداعية", icon: "brush" },
              { name: "البرمجة", desc: "التطوير الشامل، الجوال، وهندسة الويب", icon: "terminal" },
              { name: "الذكاء الاصطناعي", desc: "مهندسو تعلم الآلة وعلماء البيانات", icon: "memory" },
              { name: "المبيعات", desc: "نمو الشركات واستراتيجيات الأعمال", icon: "campaign" },
              { name: "المالية", desc: "الخدمات المصرفية والتقنية المالية", icon: "payments" },
              { name: "الهندسة", desc: "الأنظمة المدنية والميكانيكية والفضاء", icon: "architecture" },
              { name: "الرعاية الصحية", desc: "الطب الحديث والرعاية الصحية الرقمية", icon: "monitor_heart" },
              { name: "رؤية 2030", desc: "نيوم، البحر الأحمر، القدية", icon: "rocket_launch", featured: true }
            ].map((cat) => (
              <div 
                key={cat.name} 
                className={`p-10 rounded-[2rem] border transition-all duration-500 cursor-pointer group text-right ${
                  cat.featured 
                    ? "bg-[#613471] border-[#caa2f7]/30 shadow-[0_20px_40px_rgba(97,52,113,0.3)]" 
                    : "bg-[#1c181c] border-[#292428] hover:bg-[#221e22] hover:border-[#caa2f7]/20 hover:-translate-y-2"
                }`}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-10 mr-0 ml-auto group-hover:scale-110 transition-transform duration-500 ${
                  cat.featured ? "bg-white/10" : "bg-[#100d10]"
                }`}>
                  <span className={`material-symbols-outlined text-4xl ${cat.featured ? "text-white" : "text-[#caa2f7]"}`}>{cat.icon}</span>
                </div>
                <h4 className={`text-2xl font-bold mb-3 ${cat.featured ? "text-white" : "text-[#faf1f5]"}`}>{cat.name}</h4>
                <p className={`text-sm leading-relaxed ${cat.featured ? "text-white/70" : "text-[#b0a9ad]"}`}>{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-32 bg-[#1c181c]/30">
        <div className="max-w-screen-2xl mx-auto px-8">
          <div className="text-center mb-20 space-y-4">
            <h2 className="font-headline text-5xl font-bold tracking-tight">وظائف نخبوية مختارة</h2>
            <p className="text-[#b0a9ad] text-lg font-light max-w-2xl mx-auto">فرص ذات تأثير عالٍ في منظمات رائدة عالمياً توظف حالياً عبر BidJobs.</p>
          </div>

          <div className="space-y-6">
            {featuredJobs && featuredJobs.length > 0 ? featuredJobs.map((job) => {
              const company = (job.employer as any)?.company_name || (job.employer as any)?.full_name || 'شركة';
              const budget = job.budget_min && job.budget_max
                ? `$${Number(job.budget_min).toLocaleString()} – $${Number(job.budget_max).toLocaleString()}`
                : job.budget_max ? `حتى $${Number(job.budget_max).toLocaleString()}` : 'يُحدد لاحقاً';
              return (
              <div
                key={job.id}
                className="group flex flex-col md:flex-row items-center justify-between p-10 bg-[#1c181c] border border-[#292428] rounded-[2.5rem] hover:bg-[#221e22] hover:border-[#caa2f7]/30 transition-all duration-300 text-right"
              >
                <div className="flex items-center gap-8 mb-8 md:mb-0 w-full md:w-auto">
                  <div className="order-2 text-right">
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-[#caa2f7] transition-colors">{job.title}</h3>
                    <p className="text-[#b0a9ad] text-sm flex items-center justify-end gap-3">
                      {job.location || 'عن بعد'}
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4b474a]"></span>
                      <span className="font-bold text-[#faf1f5]/80">{company}</span>
                    </p>
                  </div>
                  <div className="w-20 h-20 rounded-[1.5rem] bg-[#100d10] flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform order-1 border border-[#292428]">
                    <span className="material-symbols-outlined text-3xl text-[#caa2f7]">work</span>
                  </div>
                </div>
                <div className="flex items-center gap-10 w-full md:w-auto justify-between md:justify-end">
                  <Link
                    href={`/jobs/${job.id}`}
                    className="bg-[#faf1f5] hover:bg-[#caa2f7] text-[#100d10] font-black px-12 py-4 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:shadow-[0_10px_30px_rgba(202,162,247,0.3)] shadow-none"
                  >
                    تقدم للوظيفة
                  </Link>
                  <div className="hidden sm:flex flex-col gap-2 items-end">
                    <span className="px-4 py-1.5 rounded-full bg-[#613471]/30 text-[#f1bfff] text-[10px] font-black tracking-widest">{budget}</span>
                    <span className="text-[10px] text-[#b0a9ad] uppercase tracking-[0.2em] font-bold">مفتوح</span>
                  </div>
                </div>
              </div>
              );
            }) : (
              <div className="text-center py-16 text-[#b0a9ad]">
                <span className="material-symbols-outlined text-5xl text-[#4b474a] mb-4 block">work_off</span>
                لا توجد وظائف متاحة حالياً
              </div>
            )}
          </div>

          <div className="mt-16 text-center">
            <Link href="/jobs/browse" className="px-12 py-5 rounded-2xl border border-[#4b474a] font-black text-xs tracking-[0.2em] hover:bg-[#221e22] hover:border-[#caa2f7]/50 transition-all uppercase">
              استكشف جميع الفرص
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40">
        <div className="max-w-5xl mx-auto px-8">
          <div className="relative p-24 bg-gradient-to-br from-[#1c181c] to-[#292428] rounded-[4rem] text-center overflow-hidden border border-[#caa2f7]/10 shadow-[0_40px_100px_rgba(0,0,0,0.5)] group">
            <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-[#613471]/20 rounded-full blur-[100px] group-hover:bg-[#613471]/30 transition-colors duration-1000"></div>
            
            <div className="relative z-10 space-y-10">
              <h2 className="font-headline text-6xl font-black tracking-tighter leading-none italic uppercase">
                هل أنت مستعد لبناء <br /> 
                <span className="text-[#caa2f7] non-italic">عالم الغد؟</span>
              </h2>
              <p className="text-[#b0a9ad] text-xl font-light max-w-xl mx-auto leading-relaxed">
                انضم إلى شبكة المواهب الأكثر تميزاً في المملكة واتخذ الخطوة الأولى نحو ذروة مسيرتك المهنية.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                <Link href="/join" className="bg-[#caa2f7] text-[#431f6b] font-black px-12 py-5 rounded-[1.25rem] shadow-[0_15px_40px_rgba(202,162,247,0.3)] hover:scale-[1.05] transition-all duration-300 btn-gradient">
                  أنشئ ملفك الشخصي
                </Link>
                <Link href="/jobs/browse" className="bg-[#100d10] border border-[#4b474a] text-[#faf1f5] font-black px-12 py-5 rounded-[1.25rem] hover:bg-[#221e22] hover:border-[#caa2f7]/30 transition-all duration-300">
                  استكشف الوظائف
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
