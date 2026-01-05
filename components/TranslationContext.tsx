
import React, { createContext, useContext, ReactNode } from 'react';

export type SupportedLanguage = 'English' | 'Hindi' | 'Tamil' | 'Telugu' | 'Marathi' | 'Bengali';

interface TranslationMap {
  [key: string]: {
    [K in SupportedLanguage]: string;
  };
}

export const translations: TranslationMap = {
  dashboard: { English: 'Dashboard', Hindi: 'डैशबोर्ड', Tamil: 'டாஷ்போர்டு', Telugu: 'డాష్‌బోర్డ్', Marathi: 'डॅशबोर्ड', Bengali: 'ড্যাশবোর্ড' },
  roadmap: { English: 'My Roadmap', Hindi: 'मेरा रोडमैप', Tamil: 'எனது வழிகாட்டி', Telugu: 'నా రోడ్‌మ్యాప్', Marathi: 'माझा रोडमॅप', Bengali: 'আমার রোডম্যাপ' },
  localOpps: { English: 'Local Opps', Hindi: 'स्थानीय अवसर', Tamil: 'உள்ளூர் வாய்ப்புகள்', Telugu: 'స్థానిక అవకాశాలు', Marathi: 'स्थानिक संधी', Bengali: 'স্থানীয় সুযোগ' },
  mentorship: { English: 'Mentorship', Hindi: 'परामर्श', Tamil: 'வழிகாட்டுதல்', Telugu: 'మెంటర్షిప్', Marathi: 'मार्गदर्शन', Bengali: 'পরামর্শদান' },
  settings: { English: 'Settings', Hindi: 'सेटिंग्स', Tamil: 'அமைப்புகள்', Telugu: 'సెట్టింగ్‌లు', Marathi: 'सेटिंग्ज', Bengali: 'সেটিংস' },
  signOut: { English: 'Sign Out', Hindi: 'साइन आउट', Tamil: 'வெளியேறு', Telugu: 'సైన్ అవుట్', Marathi: 'साइन आउट', Bengali: 'সাইন আউট' },
  welcomeBack: { English: 'Welcome back', Hindi: 'आपका स्वागत है', Tamil: 'மீண்டும் வருக', Telugu: 'మళ్ళీ స్వాగతం', Marathi: 'पुन्हा स्वागत आहे', Bengali: 'ফিরে আসার জন্য স্বাগতম' },
  searchPlaceholder: { English: 'Search skills, jobs, or mentors...', Hindi: 'कौशल, नौकरी या सलाहकार खोजें...', Tamil: 'திறன்கள், வேலைகள் அல்லது வழிகாட்டிகளைத் தேடுங்கள்...', Telugu: 'నైపుణ్యాలు, ఉద్యోగాలు లేదా మెంటర్ల కోసం వెతకండి...', Marathi: 'कौशल्ये, नोकऱ्या किंवा मार्गदर्शक शोधा...', Bengali: 'দক্ষতা, চাকরি বা মেন্টর খুঁজুন...' },
  saveChanges: { English: 'Save Changes', Hindi: 'परिवर्तन सहेजें', Tamil: 'மாற்றங்களைச் சேமிக்கவும்', Telugu: 'మార్పులను సేవ్ చేయండి', Marathi: 'बदल जतन करा', Bengali: 'পরিবর্তন সংরক্ষণ করুন' },
  saving: { English: 'Saving...', Hindi: 'सहेज रहा है...', Tamil: 'சேமிக்கிறது...', Telugu: 'సేవ్ అవుతోంది...', Marathi: 'जतन करत आहे...', Bengali: 'সংরক্ষণ করা হচ্ছে...' },
  saved: { English: 'Saved', Hindi: 'सहेजा गया', Tamil: 'சேமிக்கப்பட்டது', Telugu: 'సేవ్ చేయబడింది', Marathi: 'जतन केले', Bengali: 'সংরক্ষিত' },
  profileSettings: { English: 'Profile Settings', Hindi: 'प्रोफ़ाइल सेटिंग्स', Tamil: 'சுயவிவர அமைப்புகள்', Telugu: 'ప్రొఫైల్ సెట్టింగ్‌లు', Marathi: 'प्रोफाइल सेटिंग्ज', Bengali: 'প্রোফাইল সেটিংস' },
  accountCredentials: { English: 'Account Credentials', Hindi: 'खाता क्रेडेंशियल', Tamil: 'கணக்கு சான்றுகள்', Telugu: 'ఖాతా ఆధారాలు', Marathi: 'खाते क्रेडेन्शियल', Bengali: 'অ্যাকাউন্ট শংসাপত্র' },
  professionalProfile: { English: 'Professional Profile', Hindi: 'व्यावसायिक प्रोफ़ाइल', Tamil: 'தொழில்முறை சுயவிவரம்', Telugu: 'వృత్తిపరమైన ప్రొఫైల్', Marathi: 'व्यावसायिक प्रोफाइल', Bengali: 'পেশাদার প্রোফাইল' },
  localContext: { English: 'Local Context', Hindi: 'स्थानीय संदर्भ', Tamil: 'உள்ளூர் சூழல்', Telugu: 'స్థానిక సందర్భం', Marathi: 'स्थानिक संदर्भ', Bengali: 'স্থানীয় প্রেক্ষাপট' },
  skillsScore: { English: 'Skills Score', Hindi: 'कौशल स्कोर', Tamil: 'திறன் மதிப்பெண்', Telugu: 'నైపుణ్య స్కోరు', Marathi: 'कौशल्य धावसंख्या', Bengali: 'দক্ষতা স্কোর' },
  learningStreak: { English: 'Learning Streak', Hindi: 'सीखने का सिलसिला', Tamil: 'கற்றல் தொடர்ச்சி', Telugu: 'నేర్చుకునే స్ట్రీక్', Marathi: 'शिकण्याची मालिका', Bengali: 'শেখার ধারাবাহিকতা' },
  profileStrength: { English: 'Profile Strength', Hindi: 'प्रोफ़ाइल शक्ति', Tamil: 'சுயவிவர வலிமை', Telugu: 'ప్రొఫైల్ బలం', Marathi: 'प्रोफाइल सामर्थ्य', Bengali: 'প্রোফাইল শক্তি' },
  upcomingTasks: { English: 'Upcoming Weekly Tasks', Hindi: 'आगामी साप्ताहिक कार्य', Tamil: 'வரவிருக்கும் வாராந்திர பணிகள்', Telugu: 'రాబోయే వారపు పనులు', Marathi: 'आगामी साप्ताहिक कार्ये', Bengali: 'আসন্ন সাপ্তাহিক কাজ' },
  targetGoal: { English: 'Target Goal', Hindi: 'लक्ष्य', Tamil: 'இலக்கு', Telugu: 'లక్ష్యం', Marathi: 'ध्येय', Bengali: 'লক্ষ্য' },
  regenerate: { English: 'Regenerate', Hindi: 'फिर से जनरेट करें', Tamil: 'மீண்டும் உருவாக்கு', Telugu: 'మళ్లీ రూపొందించండి', Marathi: 'पुन्हा व्युत्पन्न करा', Bengali: 'পুনরায় তৈরি করুন' }
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
