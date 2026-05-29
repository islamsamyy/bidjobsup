const fs = require('fs');

const enPath = 'e:/bidjob/locales/en.json';
const arPath = 'e:/bidjob/locales/ar.json';

const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const arData = JSON.parse(fs.readFileSync(arPath, 'utf8'));

enData.blogPage = {
  ...enData.blogPage,
  visionUpdates: "Vision 2030 Updates",
  heroDate: "October 24, 2030 \u2022 12 min read",
  heroTitle: "The Architectural Shift: Defining Saudi Arabia's Tech Frontier",
  heroDesc: "How NEOM and the Red Sea Project are creating a vacuum for global elite talent and what it means for the regional economy.",
  authorName: "Dr. Fahad Al-Zahrani",
  authorRole: "Economic Strategist",
  readFullEditorial: "Read Full Editorial",
  allInsights: "All Insights",
  insightDigest: "The Insight Digest",
  insightDigestDesc: "Join 15,000+ elite professionals receiving weekly market intelligence and vision-aligned career opportunities.",
  emailPlaceholder: "Email Address",
  subscribeNow: "Subscribe Now",
  noSpam: "No spam. Only high-impact career intelligence.",
  trendingTopics: "Trending Topics",
  specialReport: "Special Report",
  specialReportTitle: "2031 Talent Outlook: The Great Re-Skilling of the GCC",
  downloadReport: "Download Report",
  readStory: "Read Story"
};

arData.blogPage = {
  ...arData.blogPage,
  visionUpdates: "تحديثات رؤية 2030",
  heroDate: "24 أكتوبر 2030 \u2022 قراءة لمدة 12 دقيقة",
  heroTitle: "التحول المعماري: تحديد آفاق التكنولوجيا في السعودية",
  heroDesc: "كيف تخلق نيوم ومشروع البحر الأحمر فراغًا للمواهب النخبوية العالمية وماذا يعني ذلك للاقتصاد الإقليمي.",
  authorName: "د. فهد الزهراني",
  authorRole: "خبير استراتيجي اقتصادي",
  readFullEditorial: "اقرأ المقال الافتتاحي كاملاً",
  allInsights: "جميع الرؤى",
  insightDigest: "موجز الرؤى",
  insightDigestDesc: "انضم إلى 15,000+ من المحترفين النخبة الذين يتلقون معلومات استخباراتية أسبوعية عن السوق وفرص عمل متوافقة مع الرؤية.",
  emailPlaceholder: "البريد الإلكتروني",
  subscribeNow: "اشترك الآن",
  noSpam: "لا للرسائل المزعجة. فقط معلومات استخباراتية عالية التأثير عن المهن.",
  trendingTopics: "المواضيع الرائجة",
  specialReport: "تقرير خاص",
  specialReportTitle: "آفاق المواهب لعام 2031: إعادة تأهيل المهارات الكبرى في دول مجلس التعاون الخليجي",
  downloadReport: "تحميل التقرير",
  readStory: "اقرأ القصة"
};

fs.writeFileSync(enPath, JSON.stringify(enData, null, 2));
fs.writeFileSync(arPath, JSON.stringify(arData, null, 2));

console.log('JSON files updated for blogPage.');
