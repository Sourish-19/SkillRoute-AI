
import React, { createContext, useContext, ReactNode } from 'react';

export type SupportedLanguage = 'English' | 'Hindi' | 'Tamil' | 'Telugu' | 'Marathi' | 'Bengali';

interface TranslationMap {
  [key: string]: {
    [K in SupportedLanguage]: string;
  };
}

export const translations: TranslationMap = {
  // Navigation
  dashboard: { English: 'Dashboard', Hindi: 'डैशबोर्ड', Tamil: 'டாஷ்போர்டு', Telugu: 'డాష్‌బోర్డ్', Marathi: 'डॅशबोर्ड', Bengali: 'ড্যাশবোর্ড' },
  roadmap: { English: 'My Roadmap', Hindi: 'मेरा रोडमैप', Tamil: 'எனது வழிகாட்டி', Telugu: 'నా రోడ్‌మ్యాప్', Marathi: 'माझा रोडमॅप', Bengali: 'আমার রোডম্যাপ' },
  localOpps: { English: 'Local Opportunities', Hindi: 'स्थानीय अवसर', Tamil: 'உள்ளூர் வாய்ப்புகள்', Telugu: 'స్థానిక అవకాశాలు', Marathi: 'स्थानिक संधी', Bengali: 'স্থানীয় সুযোগ' },
  mentorship: { English: 'Mentorship', Hindi: 'परामर्श', Tamil: 'வழிகாட்டுதல்', Telugu: 'మెంటర్షిప్', Marathi: 'मार्गदर्शन', Bengali: 'পরামর্শদান' },
  settings: { English: 'Settings', Hindi: 'सेटिंग्स', Tamil: 'அமைப்புகள்', Telugu: 'సెట్టింగ్‌లు', Marathi: 'सेटिंग्ज', Bengali: 'সেটিংস' },
  signOut: { English: 'Sign Out', Hindi: 'साइन आउट', Tamil: 'வெளியேறு', Telugu: 'సైన్ అవుట్', Marathi: 'साइन आउट', Bengali: 'সাইন আউট' },
  
  // Dashboard & General
  welcomeBack: { English: 'Welcome back', Hindi: 'आपका स्वागत है', Tamil: 'மீண்டும் வருக', Telugu: 'మళ్ళీ స్వాగతం', Marathi: 'पुन्हा स्वागत आहे', Bengali: 'ফিরে আসার জন্য স্বাগতম' },
  searchPlaceholder: { English: 'Search skills, jobs, or mentors...', Hindi: 'कौशल, नौकरी या सलाहकार खोजें...', Tamil: 'திறன்கள், வேலைகள் அல்லது வழிகாட்டிகளைத் தேடுங்கள்...', Telugu: 'నైపుణ్యాలు, ఉద్యోగాలు లేదా మెంటర్ల కోసం వెతకండి...', Marathi: 'कौशल्ये, नोकऱ्या किंवा मार्गदर्शक शोधा...', Bengali: 'দক্ষতা, চাকরি বা মেন্টর খুঁজুন...' },
  saveChanges: { English: 'Save Changes', Hindi: 'परिवर्तन सहेजें', Tamil: 'மாற்றங்களைச் சேமிக்கவும்', Telugu: 'మార్పులను సేవ్ చేయండి', Marathi: 'बदल जतन करा', Bengali: 'পরিবর্তন সংরক্ষণ করুন' },
  saving: { English: 'Saving...', Hindi: 'सहेज रहा है...', Tamil: 'சேமிக்கிறது...', Telugu: 'சேవ్ అవుతోంది...', Marathi: 'జतन करत आहे...', Bengali: 'সংরক্ষণ করা হচ্ছে...' },
  saved: { English: 'Saved', Hindi: 'सहेजा गया', Tamil: 'சேமிக்கப்பட்டது', Telugu: 'సేవ్ చేయబడింది', Marathi: 'జतन केले', Bengali: 'সংরক্ষিত' },
  skillsScore: { English: 'Skills Score', Hindi: 'कौशल स्कोर', Tamil: 'திறன் மதிப்பெண்', Telugu: 'నైపుణ్య స్కోరు', Marathi: 'कౌशल्य धावसंख्या', Bengali: 'দক্ষতা স্কোর' },
  learningStreak: { English: 'Learning Streak', Hindi: 'सीखने का सिलसिला', Tamil: 'கற்றல் தொடர்ச்சி', Telugu: 'నేర్చుకునే స్ట్రీక్', Marathi: 'शिकण्याची मालिका', Bengali: 'শেখার ধারাবাহিকতা' },
  profileStrength: { English: 'Profile Strength', Hindi: 'प्रोफ़ाइल शक्ति', Tamil: 'சுयविவர வலிமை', Telugu: 'ప్రొఫైల్ బలం', Marathi: 'प्रोफাইল सामर्थ्य', Bengali: 'প্রোফাইল শক্তি' },
  upcomingTasks: { English: 'Upcoming Weekly Tasks', Hindi: 'आगामी साप्ताहिक कार्य', Tamil: 'வரவிருக்கும் வாராந்திர பணிகள்', Telugu: 'రాబోయే వారపు పనులు', Marathi: 'आगामी साप्ताहिक कार्ये', Bengali: 'আসন্ন সাপ্তাহিক কাজ' },
  targetGoal: { English: 'Target Goal', Hindi: 'लक्ष्य', Tamil: 'இலக்கு', Telugu: 'లక్ష్యం', Marathi: 'ध्येय', Bengali: 'লক্ষ্য' },
  regenerate: { English: 'Regenerate', Hindi: 'फिर से जनरेट करें', Tamil: 'மீண்டும் உருவாக்கு', Telugu: 'మళ్లీ రూపొందించండి', Marathi: 'पुन्हा व्युत्पन्न करा', Bengali: 'পুনরায় তৈরি করুন' },
  applyNow: { English: 'Apply Now', Hindi: 'अभी आवेदन करें', Tamil: 'இப்போதே விண்ணப்பிக்கவும்', Telugu: 'ఇప్పుడే దరఖాస్తు చేసుకోండి', Marathi: 'आताच अर्ज करा', Bengali: 'এখনই আবেদন করুন' },
  viewDetails: { English: 'View Details', Hindi: 'विवरण देखें', Tamil: 'விவரங்களைக் காண்க', Telugu: 'వివరాలను చూడండి', Marathi: 'तपशील पहा', Bengali: 'বিস্তারিত দেখুন' },

  // Analysis Form
  whoAreYou: { English: 'Who are you?', Hindi: 'आप कौन हैं?', Tamil: 'நீங்கள் யார்?', Telugu: 'మీరు ఎవరు?', Marathi: 'तुम्ही कोण आहात?', Bengali: 'আপনি কে?' },
  basicsSubtitle: { English: 'Let\'s start with the basics.', Hindi: 'चलिए बुनियादी बातों से शुरू करते हैं।', Tamil: 'அடிப்படை விவரங்களுடன் தொடங்குவோம்.', Telugu: 'ప్రారంభ వివరాలతో ప్రారంభిద్దాం.', Marathi: 'चला मूलभूत गोष्टींपासून सुरुवात करूया.', Bengali: 'চলুন মৌলিক বিষয় দিয়ে শুরু করি।' },
  fullName: { English: 'Full Name', Hindi: 'पूरा नाम', Tamil: 'முழு பெயர்', Telugu: 'పూర్తి పేరు', Marathi: 'पूर्ण नाव', Bengali: 'পুরো নাম' },
  location: { English: 'Location', Hindi: 'स्थान', Tamil: 'இடம்', Telugu: 'ప్రాంతం', Marathi: 'ठिकाण', Bengali: 'অবস্থান' },
  continue: { English: 'Continue', Hindi: 'जारी रखें', Tamil: 'தொடரவும்', Telugu: 'కొనసాగించు', Marathi: 'पुढे जा', Bengali: 'চালিয়ে যান' },
  back: { English: 'Back', Hindi: 'पीछे', Tamil: 'பின்னால்', Telugu: 'వెనుకకు', Marathi: 'मागे', Bengali: 'পিছনে' },
  education: { English: 'Education', Hindi: 'शिक्षा', Tamil: 'கல்வி', Telugu: 'విద్య', Marathi: 'शिक्षण', Bengali: 'শিক্ষা' },
  skills: { English: 'Skills', Hindi: 'कौशल', Tamil: 'திறன்கள்', Telugu: 'నైపుణ్యాలు', Marathi: 'कौशल्ये', Bengali: 'দক্ষতা' },
  internetReliability: { English: 'Internet Reliability', Hindi: 'इंटरनेट विश्वसनीयता', Tamil: 'இணைய விசுவாசம்', Telugu: 'ఇంటర్నెట్ విశ్వసనీయత', Marathi: 'इंटरनेट विश्वसनीयता', Bengali: 'ইন্টারনেট নির্ভরযোগ্যতা' },
  readyToLaunch: { English: 'Ready to Launch?', Hindi: 'शुरू करने के लिए तैयार हैं?', Tamil: 'தொடங்க தயாரா?', Telugu: 'ప్రారంభించడానికి సిద్ధంగా ఉన్నారా?', Marathi: 'सुरू करण्यास तयार आहात का?', Bengali: 'শুরু করতে কি প্রস্তুত?' },
  generateRoute: { English: 'Generate My Career Route', Hindi: 'मेरा करियर रूट जनरेट करें', Tamil: 'எனது தொழில் பாதையை உருவாக்கு', Telugu: 'నా కెరీర్ రూట్‌ని రూపొందించండి', Marathi: 'माझा करिअर मार्ग तयार करा', Bengali: 'আমার ক্যারিয়ার রুট তৈরি করুন' },
  
  // Mentorship Chat
  startChat: { English: 'Start Chat', Hindi: 'चैट शुरू करें', Tamil: 'அரட்டையைத் தொடங்கு', Telugu: 'చాట్ ప్రారంభించండి', Marathi: 'चॅट सुरू करा', Bengali: 'চ্যাট শুরু করুন' },
  askAdvice: { English: 'Ask for advice...', Hindi: 'सलाह मांगें...', Tamil: 'ஆலோசனை கேளுங்கள்...', Telugu: 'సలహా అడగండి...', Marathi: 'सल्ला विचारा...', Bengali: 'পরামর্শ চান...' },
  send: { English: 'Send', Hindi: 'भेजें', Tamil: 'அனுப்பு', Telugu: 'పంపండి', Marathi: 'पाठవా', Bengali: 'পাঠান' },

  // New translations
  profileSettings: { English: 'Profile Settings', Hindi: 'प्रोफ़ाइल सेटिंग्स', Tamil: 'சுயவிவர அமைப்புகள்', Telugu: 'ప్రొఫైల్ సెట్టింగ్‌లు', Marathi: 'प्रोफाइल सेटिंग्ज', Bengali: 'প্রোফাইল সেটিংস' },
  accountCredentials: { English: 'Account Credentials', Hindi: 'खाता क्रेडेंशियल', Tamil: 'கணக்கு சான்றுகள்', Telugu: 'ఖాతా ఆధారాలు', Marathi: 'खाते क्रेडेन्शियल', Bengali: 'অ্যাকাউন্ট শংসাপত্র' },
  professionalProfile: { English: 'Professional Profile', Hindi: 'पेशेवर प्रोफ़ाइल', Tamil: 'தொழில்முறை சுயவிவரம்', Telugu: 'వృత్తిపరమైన ప్రొఫైల్', Marathi: 'व्यावसायिक प्रोफाइल', Bengali: 'পেশাদার প্রোফাইল' },
  localContext: { English: 'Local Context', Hindi: 'स्थानीय संदर्भ', Tamil: 'உள்ளூர் சூழல்', Telugu: 'స్థానిక సందర్భం', Marathi: 'स्थानिक संदर्भ', Bengali: 'স্থানীয় প্রসঙ্গ' },
  uploadPhoto: { English: 'Upload Photo', Hindi: 'फोटो अपलोड करें', Tamil: 'புகைப்படத்தைப் பதிவேற்றவும்', Telugu: 'ఫోటోను అప్‌లోడ్ చేయండి', Marathi: 'फोटो अपलोड करा', Bengali: 'ছবি আপলোড করুন' },
  theme: { English: 'Theme', Hindi: 'थीम', Tamil: 'தீம்', Telugu: 'థీమ్', Marathi: 'थीम', Bengali: 'থিম' },
};

interface TranslationContextType {
  language: SupportedLanguage;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: ReactNode; language: SupportedLanguage }> = ({ children, language }) => {
  const t = (key: string) => {
    return translations[key]?.[language] || translations[key]?.['English'] || key;
  };

  return (
    <TranslationContext.Provider value={{ language, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) throw new Error('useTranslation must be used within a TranslationProvider');
  return context;
};
