export default function Page() {
  return (
    <div dangerouslySetInnerHTML={{ __html: `<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>BidJobs | Community Feed</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif:wght@700&amp;family=Plus+Jakarta+Sans:wght@400;500;600;700&amp;family=Cormorant+Garamond:wght@600;700&amp;family=Outfit:wght@300;400;600&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        body {
            background-color: #100d10;
            color: #faf1f5;
            font-family: 'Plus Jakarta Sans', sans-serif;
            -webkit-font-smoothing: antialiased;
        }
        .glass-card {
            background: rgba(28, 24, 28, 0.6);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
        }
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
    </style>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "on-error": "#490013",
                        "primary": "#caa2f7",
                        "on-primary-fixed-variant": "#4c2975",
                        "on-tertiary-fixed": "#390013",
                        "surface": "#100d10",
                        "error": "#ff6e84",
                        "on-surface": "#faf1f5",
                        "secondary-container": "#613471",
                        "error-container": "#a70138",
                        "primary-fixed-dim": "#bc95e9",
                        "surface-bright": "#2f2b2f",
                        "tertiary-dim": "#f27793",
                        "surface-tint": "#caa2f7",
                        "surface-dim": "#100d10",
                        "inverse-surface": "#fff7fa",
                        "primary-container": "#b690e3",
                        "on-secondary-fixed": "#4d215d",
                        "outline": "#797477",
                        "primary-dim": "#bc95e9",
                        "on-primary-fixed": "#2a0052",
                        "tertiary": "#ff93aa",
                        "tertiary-fixed-dim": "#f87c98",
                        "on-background": "#faf1f5",
                        "inverse-primary": "#724e9c",
                        "on-secondary-fixed-variant": "#6c3e7c",
                        "on-tertiary": "#68082a",
                        "on-secondary": "#5a2e6a",
                        "on-primary": "#431f6b",
                        "inverse-on-surface": "#585457",
                        "on-error-container": "#ffb2b9",
                        "tertiary-container": "#fc7e9b",
                        "tertiary-fixed": "#ff8fa7",
                        "surface-variant": "#292428",
                        "secondary-fixed-dim": "#e7b0f7",
                        "secondary-dim": "#dba6eb",
                        "surface-container-lowest": "#000000",
                        "surface-container": "#1c181c",
                        "secondary-fixed": "#f2c1ff",
                        "on-tertiary-fixed-variant": "#711131",
                        "on-primary-container": "#320a5b",
                        "error-dim": "#d73357",
                        "on-surface-variant": "#b0a9ad",
                        "surface-container-high": "#221e22",
                        "secondary": "#eab3fa",
                        "outline-variant": "#4b474a",
                        "surface-container-highest": "#292428",
                        "on-tertiary-container": "#560020",
                        "surface-container-low": "#151215",
                        "primary-fixed": "#caa2f7",
                        "background": "#100d10",
                        "on-secondary-container": "#f1bfff"
                    },
                    fontFamily: {
                        "headline": ["Noto Serif"],
                        "body": ["Plus Jakarta Sans"],
                        "label": ["Plus Jakarta Sans"],
                        "serif": ["Cormorant Garamond"],
                        "outfit": ["Outfit"]
                    },
                    borderRadius: {
                        "DEFAULT": "0.125rem",
                        "lg": "0.25rem",
                        "xl": "0.5rem",
                        "full": "9999px"
                    },
                },
            },
        }
    </script>
</head>
<body class="bg-surface text-on-surface min-h-screen">
<!-- TopNavBar -->
<nav class="fixed top-0 w-full z-50 flex justify-between items-center px-8 h-20 bg-neutral-950/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
<div class="flex items-center gap-2">
<span class="text-2xl font-serif text-purple-400 drop-shadow-[0_0_8px_rgba(139,106,191,0.4)]">BidJobs</span>
</div>
<div class="hidden md:flex items-center gap-8">
<a class="text-purple-300 border-b-2 border-purple-500 pb-1 text-lg font-['Noto_Serif'] font-bold tracking-tight" href="#">Community</a>
<a class="text-neutral-400 font-['Outfit'] hover:text-purple-200 transition-colors duration-300 text-lg font-bold tracking-tight" href="#">Messages</a>
<a class="text-neutral-400 font-['Outfit'] hover:text-purple-200 transition-colors duration-300 text-lg font-bold tracking-tight" href="#">Search</a>
</div>
<div class="flex items-center gap-6">
<button class="text-neutral-400 hover:text-purple-200 transition-colors duration-300 transform active:scale-90 duration-200">
<span class="material-symbols-outlined" data-icon="notifications">notifications</span>
</button>
<button class="text-neutral-400 hover:text-purple-200 transition-colors duration-300 transform active:scale-90 duration-200">
<span class="material-symbols-outlined" data-icon="account_circle">account_circle</span>
</button>
</div>
</nav>
<!-- Sidebar Layout Container -->
<div class="flex pt-20">
<!-- SideNavBar (Left) -->
<aside class="fixed left-0 top-0 h-full flex flex-col py-8 z-40 bg-neutral-900 shadow-2xl w-64 mt-20">
<div class="px-6 mb-10">
<h2 class="font-serif text-primary text-xl tracking-wide">Talent Portal</h2>
<p class="font-['Outfit'] text-neutral-500 text-xs uppercase tracking-[0.2em]">Vision 2030 Elite</p>
</div>
<nav class="flex-1 px-4 space-y-2">
<a class="flex items-center gap-4 text-neutral-500 px-4 py-3 hover:bg-neutral-800 hover:text-neutral-200 transition-all duration-300 ease-in-out rounded-lg" href="/">
<span class="material-symbols-outlined" data-icon="dashboard">dashboard</span>
<span class="font-['Outfit']">Dashboard</span>
</a>
<a class="flex items-center gap-4 text-neutral-500 px-4 py-3 hover:bg-neutral-800 hover:text-neutral-200 transition-all duration-300 ease-in-out rounded-lg" href="/jobs">
<span class="material-symbols-outlined" data-icon="work">work</span>
<span class="font-['Outfit']">Opportunities</span>
</a>
<a class="flex items-center gap-4 bg-purple-900/20 text-purple-300 rounded-lg px-4 py-3 border-r-4 border-purple-500 transition-all duration-300 ease-in-out" href="/community">
<span class="material-symbols-outlined" data-icon="groups">groups</span>
<span class="font-['Outfit']">Community</span>
</a>
<a class="flex items-center gap-4 text-neutral-500 px-4 py-3 hover:bg-neutral-800 hover:text-neutral-200 transition-all duration-300 ease-in-out rounded-lg" href="/dashboard/messages">
<span class="material-symbols-outlined" data-icon="chat">chat</span>
<span class="font-['Outfit']">Messages</span>
</a>
<a class="flex items-center gap-4 text-neutral-500 px-4 py-3 hover:bg-neutral-800 hover:text-neutral-200 transition-all duration-300 ease-in-out rounded-lg" href="#">
<span class="material-symbols-outlined" data-icon="settings">settings</span>
<span class="font-['Outfit']">Settings</span>
</a>
</nav>
<div class="px-6 mt-6">
<button class="w-full py-3 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold rounded-xl shadow-lg shadow-primary/20 transform active:scale-95 transition-all">
                    Post a Bid
                </button>
</div>
<div class="mt-auto px-4 pb-12 space-y-2 border-t border-white/5 pt-6">
<a class="flex items-center gap-4 text-neutral-500 px-4 py-3 hover:bg-neutral-800 hover:text-neutral-200 transition-all duration-300" href="/contact">
<span class="material-symbols-outlined" data-icon="help">help</span>
<span class="font-['Outfit']">Support</span>
</a>
<a class="flex items-center gap-4 text-neutral-500 px-4 py-3 hover:bg-neutral-800 hover:text-neutral-200 transition-all duration-300" href="#">
<span class="material-symbols-outlined" data-icon="logout">logout</span>
<span class="font-['Outfit']">Logout</span>
</a>
</div>
</aside>
<!-- Main Feed Content (Center) -->
<main class="ml-64 mr-80 flex-1 px-12 py-10 max-w-4xl mx-auto">
<!-- Feed Header -->
<header class="mb-12">
<h1 class="font-headline text-5xl mb-4 text-on-surface">The Intelligence</h1>
<p class="font-body text-on-surface-variant max-w-lg leading-relaxed">
                    Exclusive insights and high-stakes conversations from the world's most elite digital architects and strategy leads.
                </p>
</header>
<!-- Create Post Module -->
<div class="mb-12 glass-card rounded-xl p-6 border border-white/5">
<div class="flex gap-4">
<img alt="Profile" class="w-12 h-12 rounded-full object-cover" data-alt="portrait of a successful male entrepreneur in a dark turtleneck looking confident" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDC-s3nMDhhJBOqhiiolRiLKNADvW9qIOIKeyFRUtM5Cv8YP4AhdX1gFoR1rem65haXTkZaP5ARji8S0rJLdVFeHHnqbZmRgs-nAPs79wrWcgILSGbVhMlEhlP4i72Ygx1eYJr-KAMLfGKrJHIEX_mw0r5eCAS1IB6ddkiPSoyKIxFesCj4vgohWwVb5H1KIH331V9cQyxwRaXhdrZXjWVLh1exyYuQsLG8SA4zbox5xcf06Cpwnde-8-HNerqzUlNpgFTkOVlhhAzD"/>
<div class="flex-1">
<textarea class="w-full bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-neutral-600 resize-none font-body text-lg" placeholder="Share a strategic insight..." rows="2"></textarea>
<div class="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
<div class="flex gap-4 text-neutral-500">
<button class="hover:text-primary transition-colors"><span class="material-symbols-outlined">image</span></button>
<button class="hover:text-primary transition-colors"><span class="material-symbols-outlined">analytics</span></button>
<button class="hover:text-primary transition-colors"><span class="material-symbols-outlined">link</span></button>
</div>
<button class="px-6 py-2 bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-on-primary transition-all rounded-full font-bold text-sm">Publish Post</button>
</div>
</div>
</div>
</div>
<!-- Feed Posts -->
<div class="space-y-8">
<!-- Post 1 (Text + Image) -->
<article class="glass-card rounded-xl overflow-hidden border border-white/5 group">
<div class="p-8">
<div class="flex justify-between items-start mb-6">
<div class="flex gap-4">
<img alt="Elena V." class="w-14 h-14 rounded-full object-cover border-2 border-primary/30" data-alt="professional portrait of a high-end female consultant with elegant minimalist jewelry" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdicKkhIwwhqwwwkw7L_4c7bmkfnkvR-sy0zUrmCJqesS7flq30XUdrTCvPbJVzjkfLV5jedrLA-h95v4FqipvjYB9YVo9ETtXGbBGDuytrVzcoUh0CBpYOsbdyEoHtzV69gOj2HKZsil3mpvqcslVtsH6n1pYJT5x9XbTOUzrTKyJO6JBt0caP5btkzkkSnBlzsZY07-_hj_Lf3QU64jHWPiLHPFG5Jm3Ku11aVt1rvZ-PQdnzCsUKTIElZ5B21FAm66MT4UeVJ0Y"/>
<div>
<h3 class="font-serif text-xl text-primary">Elena Valerius</h3>
<div class="flex gap-2 items-center">
<span class="text-xs font-label bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full">Top 1% Contributor</span>
<span class="text-xs text-neutral-500 font-outfit">Ex-Apple • Strategy Lead</span>
</div>
</div>
</div>
<span class="text-neutral-600 font-outfit text-sm">2h ago</span>
</div>
<p class="font-body text-lg text-on-surface/90 leading-relaxed mb-6">
                            The shift towards <span class="text-primary italic">asymmetric digital identities</span> is accelerating. In Vision 2030, your reputation won't be a resume—it will be a cryptographically verified stream of high-value contributions. Are you building your stream yet?
                        </p>
<div class="rounded-xl overflow-hidden mb-6 aspect-video">
<img alt="Vision 2030 Concept" class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" data-alt="abstract architectural 3d render with ethereal purple neon lights and sharp obsidian edges" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoy_ebzekEmHIwVfyI316nI5KCu1XanW7gBMTIls5ultfypHgONo4Mi9liVRmHZuJEniVc-Dai4_M8YPmHCt2XBHkDs4IUJnOAx2pvoChkG1fMYLQSanH_79eHcx4shkgh4VOjJOiMWHtioMw8t_k7IgkzJh903cD_vVzRze0CnPlnuyZWgGn3SPU4y5qQnPRRQeZjJ-c_X0EhSmCXh6Daus8qDfR3hGt9wNF5d6GBEvbBVxeZ7cZjtn9NPAIuy9xsJ5fma0e3szWg"/>
</div>
<div class="flex items-center justify-between pt-6 border-t border-white/5">
<div class="flex gap-8">
<button class="flex items-center gap-2 text-neutral-400 hover:text-primary transition-all">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">stars</span>
<span class="font-outfit text-sm font-semibold">Applaud (142)</span>
</button>
<button class="flex items-center gap-2 text-neutral-400 hover:text-primary transition-all">
<span class="material-symbols-outlined">chat_bubble</span>
<span class="font-outfit text-sm font-semibold">Comment (24)</span>
</button>
</div>
<button class="flex items-center gap-2 text-neutral-400 hover:text-primary transition-all">
<span class="material-symbols-outlined">share</span>
<span class="font-outfit text-sm font-semibold">Share</span>
</button>
</div>
</div>
</article>
<!-- Post 2 (Insight Card) -->
<article class="bg-surface-container-low rounded-xl border-l-4 border-primary p-8 shadow-2xl">
<div class="flex justify-between items-start mb-6">
<div class="flex gap-4">
<img alt="Marcus Chen" class="w-14 h-14 rounded-full object-cover" data-alt="close up headshot of a stylish male architect with architectural studio background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_naMavda7eEIViCGN7wUMRpLEfNF1Vd13RgUEA1tS9YjjpMbUkdRE_x5LwEJb7tOkFFMPFPd-mK5MlQcez7FcmlymbDcMJRvv3855wniVRxEFXQPWtxkYVW7KxmaoJfWgycDZjZVfOQkvg_yREQd2_qYb9eG3nNzYQtEc5MPB2eQwCAJRoIsBHqXmVW8mpCfKMyary2Izsjya692Hi7OIPhb4i8C-fAQbsHcq9KjIUxGWB5nlmjeNuvDG6pQqT0tgVEdUmCXXGFai"/>
<div>
<h3 class="font-serif text-xl text-on-surface">Marcus Chen</h3>
<div class="flex gap-2 items-center">
<span class="text-xs font-label bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded-full">Elite Architect</span>
<span class="text-xs text-neutral-500 font-outfit">Project Lead at OmniGroup</span>
</div>
</div>
</div>
<span class="text-neutral-600 font-outfit text-sm">5h ago</span>
</div>
<div class="font-serif text-2xl text-primary-container leading-tight mb-4 italic">
                        "The most valuable asset in the modern talent economy is not skill—it's high-fidelity intuition. Machines can code, but they can't decide what's worth building."
                    </div>
<div class="flex items-center justify-between pt-6">
<div class="flex gap-8">
<button class="flex items-center gap-2 text-neutral-400 hover:text-primary transition-all">
<span class="material-symbols-outlined">stars</span>
<span class="font-outfit text-sm font-semibold">Applaud (318)</span>
</button>
<button class="flex items-center gap-2 text-neutral-400 hover:text-primary transition-all">
<span class="material-symbols-outlined">chat_bubble</span>
<span class="font-outfit text-sm font-semibold">Comment (12)</span>
</button>
</div>
<button class="flex items-center gap-2 text-neutral-400 hover:text-primary transition-all">
<span class="material-symbols-outlined">share</span>
<span class="font-outfit text-sm font-semibold">Share</span>
</button>
</div>
</article>
</div>
</main>
<!-- Right Sidebar -->
<aside class="fixed right-0 top-0 h-full w-80 pt-28 px-8 bg-surface-container-low border-l border-white/5 z-30">
<div class="mb-10">
<h4 class="font-serif text-primary text-sm uppercase tracking-widest mb-6 border-b border-primary/20 pb-2">Trending Topics</h4>
<div class="space-y-6">
<div>
<span class="text-xs text-neutral-500 font-outfit">01 / TECHNOLOGY</span>
<h5 class="font-body font-bold text-on-surface hover:text-primary cursor-pointer transition-colors">Quantum Project Bidding</h5>
<p class="text-xs text-neutral-600 mt-1">1,240 active conversations</p>
</div>
<div>
<span class="text-xs text-neutral-500 font-outfit">02 / ARCHITECTURE</span>
<h5 class="font-body font-bold text-on-surface hover:text-primary cursor-pointer transition-colors">Metaverse Real Estate Peaks</h5>
<p class="text-xs text-neutral-600 mt-1">892 active conversations</p>
</div>
<div>
<span class="text-xs text-neutral-500 font-outfit">03 / STRATEGY</span>
<h5 class="font-body font-bold text-on-surface hover:text-primary cursor-pointer transition-colors">Post-AI Compensation Models</h5>
<p class="text-xs text-neutral-600 mt-1">544 active conversations</p>
</div>
</div>
</div>
<div>
<h4 class="font-serif text-primary text-sm uppercase tracking-widest mb-6 border-b border-primary/20 pb-2">Top Contributors</h4>
<div class="space-y-4">
<div class="flex items-center justify-between">
<div class="flex items-center gap-3">
<img alt="User" class="w-8 h-8 rounded-full" data-alt="professional portrait of a high-achieving woman in tech with neutral lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuClgqVJUopuO3EChq4R0Kdn31AgHFwn3jbSnS9N3AnKAvS5tLcuyDoY1DDEl3OSUoOVlRIibxB0wto3fk1nXYv2RbwYFO-s649UwaJuT0TyF6FPvinjo8V57G91bERBumQVMIsBn7k9Sxg8H4wwSd1FryhdHiutm6kr5AmnzjiEgdsL6tSAPCP6L72M30S2lCy3EnXbmRv37U02jAfVdSneNOyH1B0lZBRoj9iZB5guABPt9rls9eMjtLW_Df1MwS2Ns7VuUrdkPlWB"/>
<span class="text-sm font-body font-semibold">Sarah J.</span>
</div>
<span class="text-xs font-serif italic text-primary">24k Points</span>
</div>
<div class="flex items-center justify-between">
<div class="flex items-center gap-3">
<img alt="User" class="w-8 h-8 rounded-full" data-alt="portrait of a man in professional attire with soft focus background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1uLaplrjQ9D50AGQVYtfUmzS6VOuQBddVLb3M_vs1HSpJ0Pu8xUsi--1UibGNMm-7_FhvHdAmi_rAfBTURG0AT2kJkY3xC4yHdqRwfWhsTrshAwk-xx9GCE9LJbs8-eoMTtQJOsATklvRI-pcRi9fCGhgok3sJyyD8eTSAu1d1AT5PARo6ShZq1ie3UnmLBkFbp39OOlbpCsqkfH_czgL4up_k265ovCeVSdIPP718QfJZbO6fYjwc1xexZhppHWFtRZ5HkDOqtEz"/>
<span class="text-sm font-body font-semibold">Viktor L.</span>
</div>
<span class="text-xs font-serif italic text-primary">19k Points</span>
</div>
<div class="flex items-center justify-between">
<div class="flex items-center gap-3">
<img alt="User" class="w-8 h-8 rounded-full" data-alt="close up of a professional woman looking forward with confidence" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUiGQcdrUnis4PCPynr8_Y87iiRZc_VuWAZytcVB6KnXp02s9Wf3cw22699Cqh7TEe35d6-HtxyZ2olMPw4qfczZJBXGdZNaO8HCFRzl-PWEeJJfHY-D6duARqRFvDscC83V9AkuiTMAeuSnOOq-rKf4osZpKBHLLfRtG9W7GEmbIftaooF-jbEUgaiICFdH6322uoYpAmg6w5_05_VZfqj4KmmHBm0dQoHJVVyIgI8PIFUw1o2-1377Ud0bK_Oegh0Ll-eg-oN5IM"/>
<span class="text-sm font-body font-semibold">Aria M.</span>
</div>
<span class="text-xs font-serif italic text-primary">15k Points</span>
</div>
</div>
<button class="w-full mt-8 py-2 text-xs font-outfit text-neutral-500 border border-neutral-800 hover:border-primary/50 hover:text-primary transition-all rounded-lg uppercase tracking-widest">
                    View Leaderboard
                </button>
</div>
</aside>
</div>
<!-- Mobile BottomNavBar (Hidden on desktop) -->
<nav class="md:hidden fixed bottom-0 left-0 w-full h-16 bg-neutral-900 border-t border-white/5 flex items-center justify-around z-50">
<span class="material-symbols-outlined text-neutral-500" data-icon="dashboard">dashboard</span>
<span class="material-symbols-outlined text-neutral-500" data-icon="work">work</span>
<div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center -mt-8 shadow-lg shadow-primary/40">
<span class="material-symbols-outlined text-on-primary" data-icon="add">add</span>
</div>
<span class="material-symbols-outlined text-primary" data-icon="groups">groups</span>
<span class="material-symbols-outlined text-neutral-500" data-icon="settings">settings</span>
</nav>
</body></html>` }} />
  );
}
