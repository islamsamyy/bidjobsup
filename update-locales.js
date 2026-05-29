const fs = require('fs');

const enPath = 'e:/bidjob/locales/en.json';
const arPath = 'e:/bidjob/locales/ar.json';

const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const arData = JSON.parse(fs.readFileSync(arPath, 'utf8'));

const newEnKeys = {
  joinPage: {
    gateway: "Gateway to Excellence",
    title1: "Define your",
    title2: "Trajectory",
    subtitle: "Select your entry point to the Vision 2030 talent ecosystem. Elite opportunities meet exceptional leadership.",
    freelancer: "I am a Freelancer",
    freelancerDesc: "Access exclusive high-stakes roles, architectural mandates, and senior leadership positions within firms redefining the Kingdom's future.",
    secureOpp: "Secure Opportunities",
    company: "I am a Company",
    companyDesc: "Source world-class talent, manage elite bidding protocols, and build at the speed of vision with professionals who redefine industry.",
    recruitExc: "Recruit Excellence",
    alreadyPart: "Already part of the collective?",
    signInHere: "Sign in here"
  },
  jobsBrowsePage: {
    secureMission1: "Secure your next",
    secureMission2: "high-stakes mission.",
    subtitle: "Connecting elite talent with avant-garde industries. Experience the next generation of professional acquisition.",
    role: "Role",
    location: "Location",
    industry: "Industry",
    allIndustries: "All Industries",
    searchBids: "SEARCH BIDS",
    curatedSectors: "CURATED SECTORS",
    eliteClusters: "Elite Clusters",
    allSectors: "All Sectors",
    activeRoles: "Active Roles",
    availableMissions: "Available Missions",
    filteredResults: "Filtered results for your selection",
    hottestOpp: "Hottest opportunities right now",
    recommended: "Recommended",
    recent: "Recent",
    noMissions: "No Missions Detected",
    noMissionsDesc: "None of the broadcasted roles match your current parameters. Reset search or broaden your filters.",
    resetSearch: "RESET SEARCH",
    liveMissionClusters: "Live Mission Clusters",
    capitalInflow: "Capital Inflow",
    clientAlignment: "Client Alignment"
  },
  atsOptimizePage: {
    title: "ATS Optimizer",
    subtitle: "Optimize your CV for Applicant Tracking Systems. Get a detailed analysis and recommendations to improve your chances of passing ATS filters and getting noticed by employers.",
    yourCv: "Your CV/Resume",
    uploadPdf: "Upload PDF",
    pasteText: "Paste Text",
    dragDrop: "Drag and drop your PDF or text file",
    orClick: "or click to browse (max 5MB)",
    processing: "Processing...",
    fileLoaded: "File loaded successfully",
    characters: "characters",
    pasteCv: "Paste your CV/Resume text here...",
    targetJob: "Target Job Description",
    pasteJob: "Paste the job description you're applying for...",
    error: "Error",
    analyzing: "Analyzing...",
    analyzeCv: "Analyze CV for ATS",
    useCvEditor: "Use CV Editor",
    backToHome: "Back to Home",
    moreFeatures: "More Features",
    cvEditor: "CV Editor",
    cvEditorDesc: "Edit your CV and see live ATS score updates",
    batchAnalyzer: "Batch Analyzer",
    batchAnalyzerDesc: "Compare one CV against multiple jobs or vice versa",
    viewHistory: "View History",
    viewHistoryDesc: "Track your ATS improvement over time with analytics",
    quickAnalysis: "Quick Analysis",
    quickAnalysisDesc: "Get instant feedback on your CV compatibility with the job description in seconds.",
    detailedScore: "Detailed Score",
    detailedScoreDesc: "See your match percentage and get specific insights on missing keywords and skills.",
    smartTips: "Smart Tips",
    smartTipsDesc: "Get actionable recommendations to optimize your CV and improve your chances."
  }
};

const newArKeys = {
  joinPage: {
    gateway: "بوابة التميز",
    title1: "حدد",
    title2: "مسارك",
    subtitle: "اختر نقطة دخولك إلى نظام مواهب رؤية 2030. فرص استثنائية تلتقي بقيادة متميزة.",
    freelancer: "أنا مستقل",
    freelancerDesc: "احصل على وصول إلى أدوار حصرية ذات أهمية عالية ومناصب قيادية عليا ضمن الشركات التي تعيد تعريف مستقبل المملكة.",
    secureOpp: "تأمين الفرص",
    company: "أنا شركة",
    companyDesc: "ابحث عن مواهب عالمية المستوى، وقم بإدارة بروتوكولات تقديم العطاءات النخبوية، وابنِ بسرعة الرؤية مع محترفين يعيدون تعريف الصناعة.",
    recruitExc: "توظيف التميز",
    alreadyPart: "هل أنت جزء من المجموعة بالفعل؟",
    signInHere: "سجل الدخول هنا"
  },
  jobsBrowsePage: {
    secureMission1: "قم بتأمين",
    secureMission2: "مهمتك التالية عالية الأهمية.",
    subtitle: "ربط المواهب النخبوية بالصناعات الرائدة. جرب الجيل القادم من الاستحواذ المهني.",
    role: "الدور",
    location: "الموقع",
    industry: "الصناعة",
    allIndustries: "جميع الصناعات",
    searchBids: "ابحث عن العطاءات",
    curatedSectors: "قطاعات منتقاة",
    eliteClusters: "المجموعات النخبوية",
    allSectors: "جميع القطاعات",
    activeRoles: "أدوار نشطة",
    availableMissions: "المهام المتاحة",
    filteredResults: "نتائج مصفاة لاختيارك",
    hottestOpp: "أهم الفرص الآن",
    recommended: "موصى به",
    recent: "حديث",
    noMissions: "لم يتم العثور على مهام",
    noMissionsDesc: "لا تتطابق أي من الأدوار المبثوثة مع معاييرك الحالية. أعد تعيين البحث أو وسع مرشحاتك.",
    resetSearch: "إعادة تعيين البحث",
    liveMissionClusters: "مجموعات المهام الحية",
    capitalInflow: "تدفق رأس المال",
    clientAlignment: "التوافق مع العميل"
  },
  atsOptimizePage: {
    title: "مُحسِّن نظام تتبع المتقدمين (ATS)",
    subtitle: "قم بتحسين سيرتك الذاتية لأنظمة تتبع المتقدمين. احصل على تحليل مفصل وتوصيات لتحسين فرصك في اجتياز فلاتر ATS وجذب انتباه أصحاب العمل.",
    yourCv: "سيرتك الذاتية",
    uploadPdf: "تحميل ملف PDF",
    pasteText: "لصق النص",
    dragDrop: "اسحب وأفلت ملف PDF أو نص",
    orClick: "أو انقر للتصفح (الحد الأقصى 5 ميجابايت)",
    processing: "جاري المعالجة...",
    fileLoaded: "تم تحميل الملف بنجاح",
    characters: "حرف",
    pasteCv: "الصق نص سيرتك الذاتية هنا...",
    targetJob: "الوصف الوظيفي المستهدف",
    pasteJob: "الصق الوصف الوظيفي الذي تتقدم إليه...",
    error: "خطأ",
    analyzing: "جاري التحليل...",
    analyzeCv: "تحليل السيرة الذاتية لـ ATS",
    useCvEditor: "استخدم محرر السيرة الذاتية",
    backToHome: "العودة للرئيسية",
    moreFeatures: "المزيد من الميزات",
    cvEditor: "محرر السيرة الذاتية",
    cvEditorDesc: "قم بتحرير سيرتك الذاتية وشاهد تحديثات نقاط ATS المباشرة",
    batchAnalyzer: "محلل الدفعات",
    batchAnalyzerDesc: "قارن سيرة ذاتية واحدة بعدة وظائف أو العكس",
    viewHistory: "عرض السجل",
    viewHistoryDesc: "تتبع تحسن ATS الخاص بك بمرور الوقت باستخدام التحليلات",
    quickAnalysis: "تحليل سريع",
    quickAnalysisDesc: "احصل على ملاحظات فورية حول توافق سيرتك الذاتية مع الوصف الوظيفي في ثوانٍ.",
    detailedScore: "درجة مفصلة",
    detailedScoreDesc: "شاهد نسبة التطابق الخاصة بك واحصل على رؤى محددة حول الكلمات الرئيسية والمهارات المفقودة.",
    smartTips: "نصائح ذكية",
    smartTipsDesc: "احصل على توصيات قابلة للتنفيذ لتحسين سيرتك الذاتية وزيادة فرصك."
  }
};

Object.assign(enData, newEnKeys);
Object.assign(arData, newArKeys);

fs.writeFileSync(enPath, JSON.stringify(enData, null, 2));
fs.writeFileSync(arPath, JSON.stringify(arData, null, 2));

console.log('JSON files updated successfully.');
