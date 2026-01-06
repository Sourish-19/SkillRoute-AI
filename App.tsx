
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Overview } from './components/Overview';
import { RoadmapBuilder } from './components/RoadmapBuilder';
import { LocalOpportunitiesFeed } from './components/LocalOpportunitiesFeed';
import { Mentorship } from './components/Mentorship';
import { ProfilePage } from './components/ProfilePage';
import { AnalysisForm } from './components/AnalysisForm';
import { LandingPage } from './components/LandingPage';
import { Auth } from './components/Auth';
import { TranslationProvider, SupportedLanguage } from './components/TranslationContext';
import { StudentProfile, Roadmap, LocalOpportunity } from './types';

type ViewState = 'landing' | 'auth' | 'app';

export default function App() {
  const [view, setView] = useState<ViewState>('landing');
  const [activeTab, setActiveTab] = useState('overview');
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Caching state
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [opportunities, setOpportunities] = useState<LocalOpportunity[] | null>(null);
  const [mentors, setMentors] = useState<any[] | null>(null);

  useEffect(() => {
    const savedProfile = localStorage.getItem('skillroute_profile');
    const savedUser = localStorage.getItem('skillroute_user');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setView('app');
    }
    
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleLogin = (email: string) => {
    const userData = { email };
    setUser(userData);
    localStorage.setItem('skillroute_user', JSON.stringify(userData));
    setView('app');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('skillroute_user');
    setView('landing');
  };

  const handleProfileUpdate = (newProfile: StudentProfile) => {
    setProfile(newProfile);
    // Clear cache if critical fields changed
    setRoadmap(null);
    setOpportunities(null);
    setMentors(null);
    localStorage.setItem('skillroute_profile', JSON.stringify(newProfile));
  };

  const currentLang = (profile?.preferredLanguage as SupportedLanguage) || 'English';

  return (
    <TranslationProvider language={currentLang}>
      <div className="bg-[#09090b] text-zinc-100">
        {view === 'landing' && (
          <LandingPage onStart={() => setView('auth')} />
        )}
        
        {view === 'auth' && (
          <Auth onBack={() => setView('landing')} onAuth={handleLogin} />
        )}

        {view === 'app' && (
          !profile ? (
            <div className="min-h-screen flex items-center justify-center p-4">
              <AnalysisForm onComplete={(p) => {
                handleProfileUpdate(p);
                setActiveTab('overview');
              }} />
            </div>
          ) : (
            <div className="flex h-screen overflow-hidden">
              <Sidebar 
                isOpen={isSidebarOpen} 
                isMobileOpen={isMobileSidebarOpen}
                activeTab={activeTab} 
                onTabChange={(tab) => {
                  setActiveTab(tab);
                  setIsMobileSidebarOpen(false);
                }} 
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                onCloseMobile={() => setIsMobileSidebarOpen(false)}
                onLogout={handleLogout}
              />
              
              <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <Header 
                  profile={profile} 
                  onSearch={setSearchQuery}
                  onOpenProfile={() => setActiveTab('profile')} 
                  onToggleSidebar={() => setIsMobileSidebarOpen(true)}
                />
                
                <div className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10">
                  <div className="max-w-7xl mx-auto space-y-8">
                    {activeTab === 'overview' && profile && <Overview profile={profile} />}
                    {activeTab === 'roadmap' && profile && (
                      <RoadmapBuilder 
                        profile={profile} 
                        cachedData={roadmap} 
                        onUpdate={setRoadmap} 
                        searchQuery={searchQuery}
                      />
                    )}
                    {activeTab === 'opportunities' && profile && (
                      <LocalOpportunitiesFeed 
                        profile={profile} 
                        cachedData={opportunities} 
                        onUpdate={setOpportunities} 
                        searchQuery={searchQuery}
                      />
                    )}
                    {activeTab === 'mentorship' && profile && (
                      <Mentorship 
                        profile={profile} 
                        cachedData={mentors} 
                        onUpdate={setMentors} 
                        searchQuery={searchQuery}
                      />
                    )}
                    {activeTab === 'profile' && profile && user && (
                      <ProfilePage 
                        profile={profile} 
                        userEmail={user.email}
                        onUpdate={handleProfileUpdate}
                        onUpdateEmail={(email) => {
                           if(user) setUser({...user, email});
                        }}
                      />
                    )}
                    {activeTab === 'setup' && <AnalysisForm onComplete={(p) => {
                      handleProfileUpdate(p);
                      setActiveTab('overview');
                    }} initialData={profile || undefined} />}
                  </div>
                </div>
              </main>
            </div>
          )
        )}
      </div>
    </TranslationProvider>
  );
}
