const fs = require('fs');

const enPath = 'e:/bidjob/locales/en.json';
const arPath = 'e:/bidjob/locales/ar.json';

const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const arData = JSON.parse(fs.readFileSync(arPath, 'utf8'));

enData.talentPage = {
  ...enData.talentPage,
  specialistNetwork: "Specialist Network",
  findYour: "Find Your",
  edge: "Edge.",
  searchPlaceholder: "Search by skill, name, or expertise...",
  allIndustries: "All Industries",
  filterTalent: "Filter Talent",
  protocolError: "Protocol error occurred while searching.",
  noTalentFound: "No Talent Found",
  noTalentFoundDesc: "Try adjusting your search filters to find specialists.",
  readyToStart: "Ready to start hiring?",
  connectDirectly: "Connect directly with vetted specialists and negotiate contracts in our secure ecosystem.",
  postMandate: "Post a Mandate",
  joinNetwork: "Join the Network"
};

arData.talentPage = {
  ...arData.talentPage,
  specialistNetwork: "شبكة المتخصصين",
  findYour: "ابحث عن",
  edge: "تميزك.",
  searchPlaceholder: "ابحث بالمهارة، الاسم، أو الخبرة...",
  allIndustries: "جميع الصناعات",
  filterTalent: "تصفية المواهب",
  protocolError: "حدث خطأ في البروتوكول أثناء البحث.",
  noTalentFound: "لم يتم العثور على مواهب",
  noTalentFoundDesc: "حاول تعديل مرشحات البحث الخاصة بك للعثور على متخصصين.",
  readyToStart: "جاهز للبدء في التوظيف؟",
  connectDirectly: "تواصل مباشرة مع متخصصين معتمدين وتفاوض على العقود في نظامنا البيئي الآمن.",
  postMandate: "انشر تفويضاً",
  joinNetwork: "انضم إلى الشبكة"
};

fs.writeFileSync(enPath, JSON.stringify(enData, null, 2));
fs.writeFileSync(arPath, JSON.stringify(arData, null, 2));

console.log('JSON files updated for talentPage.');
