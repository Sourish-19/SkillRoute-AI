import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar.tsx';

import { Overview } from './components/Overview.tsx';
import { RoadmapBuilder } from './components/RoadmapBuilder.tsx';
import { LocalOpportunitiesFeed } from './components/LocalOpportunitiesFeed.tsx';
import { Mentorship } from './components/Mentorship.tsx';
import { ProfilePage } from './components/ProfilePage.tsx';
import { AnalysisForm } from './components/AnalysisForm.tsx';
import { LandingPage } from './components/LandingPage.tsx';
import { Auth } from './components/Auth.tsx';
import ScrollToTop from './components/ScrollToTop.tsx';
import TargetCursor from './components/TargetCursor.tsx';
import { TranslationProvider, SupportedLanguage } from './components/TranslationContext.tsx';
import { StudentProfile, Roadmap, LocalOpportunity } from './types.ts';
import { ChatAssistant } from './components/ChatAssistant.tsx';
import RevealLoader from './components/reveal-loader.tsx';

// Main Application Layout (Authenticated)
const DashboardLayout = ({
  user,
  profile,
  onLogout,
  onProfileUpdate,
  children
}: any) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <AnalysisForm onComplete={(p) => onProfileUpdate(p)} />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        isOpen={isSidebarOpen}
        isMobileOpen={isMobileSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onLogout={onLogout}
      />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Mobile Toggle (Floating) */}
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="md:hidden absolute top-4 left-4 z-50 p-2 text-zinc-400 hover:text-white bg-zinc-900/50 rounded-lg backdrop-blur-sm"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10">
          <div className="max-w-7xl mx-auto space-y-8">
            <Outlet />
          </div>
        </div>
      </main>

      <ChatAssistant profile={profile} />
    </div>
  );
};

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('skillroute_token');
  // Basic check. In a real app we might verify expiry.
  if (!token) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
};

// Wrapper for scrolling to top on route change
function ScrollToTopWrapper() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    const scrollContainer = document.querySelector('.overflow-y-auto');
    if (scrollContainer) {
      scrollContainer.scrollTo(0, 0);
    }
  }, [pathname]);
  return null;
}

export default function App() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [loading, setLoading] = useState(window.location.pathname === '/');
  const [heroVisible, setHeroVisible] = useState(window.location.pathname !== '/');

  // Caching state (Consider moving to React Query or Context later)
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [opportunities, setOpportunities] = useState<LocalOpportunity[] | null>(null);
  const [mentors, setMentors] = useState<any[] | null>(null);

  // Shared state for search (could be context)
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const savedProfile = localStorage.getItem('skillroute_profile');
    const savedUser = localStorage.getItem('skillroute_user');
    const token = localStorage.getItem('skillroute_token');

    // Check token first
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }

    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
  }, []);

  const handleLogin = (email: string) => {
    const userData = { email };
    setUser(userData);
    localStorage.setItem('skillroute_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('skillroute_user');
    localStorage.removeItem('skillroute_token');
    window.location.href = '/';
  };

  const handleProfileUpdate = (newProfile: StudentProfile) => {
    setProfile(newProfile);
    setRoadmap(null);
    setOpportunities(null);
    setMentors(null);
    localStorage.setItem('skillroute_profile', JSON.stringify(newProfile));
  };

  const currentLang = (profile?.preferredLanguage as SupportedLanguage) || 'English';

  return (
    <TranslationProvider language={currentLang}>
      {loading && (
        <RevealLoader
          text="SKILLROUTE AI"
          bgColors={["#059669", "#34d399", "#6ee7b7"]}
          textColor="black"
          textSize="8vw"
          angle={90}
          staggerOrder="center-out"
          movementDirection="top-down"
          textFadeDelay={0.5}
          className="fixed inset-0 z-[100]"
          onOpen={() => setHeroVisible(true)}
          onComplete={() => setLoading(false)}
        />
      )}
      <TargetCursor
        spinDuration={4}
        hideDefaultCursor={true}
        parallaxOn={true}
        targetSelector=".cursor-target"
      />
      {/* ScrollToTop should ideally be inside Router, customized */}

      <div className="bg-[#09090b] text-zinc-100 min-h-screen">
        <BrowserRouter>
          <ScrollToTopWrapper />
          <Routes>
            <Route path="/" element={<LandingPageWrapper showNav={heroVisible} showHero={heroVisible} />} />
            <Route path="/auth" element={<AuthWrapper onAuth={handleLogin} />} />

            {/* Authenticated Routes */}
            <Route path="/dashboard" element={
              <RequireAuth>
                <DashboardLayout
                  user={user}
                  profile={profile}
                  onLogout={handleLogout}
                  onProfileUpdate={handleProfileUpdate}
                />
              </RequireAuth>
            }>
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" element={profile && <Overview profile={profile} />} />
              <Route path="roadmap" element={profile && (
                <RoadmapBuilder
                  profile={profile}
                  cachedData={roadmap}
                  onUpdate={setRoadmap}
                  searchQuery={searchQuery}
                />
              )} />
              <Route path="opportunities" element={profile && (
                <LocalOpportunitiesFeed
                  profile={profile}
                  cachedData={opportunities}
                  onUpdate={setOpportunities}
                  searchQuery={searchQuery}
                />
              )} />
              <Route path="mentorship" element={profile && (
                <Mentorship
                  profile={profile}
                  cachedData={mentors}
                  onUpdate={setMentors}
                  searchQuery={searchQuery}
                />
              )} />
              <Route path="profile" element={profile && user && (
                <ProfilePage
                  profile={profile}
                  userEmail={user.email}
                  onUpdate={handleProfileUpdate}
                  onUpdateEmail={(email) => {
                    if (user) {
                      const u = { ...user, email };
                      setUser(u);
                      localStorage.setItem('skillroute_user', JSON.stringify(u));
                    }
                  }}
                />
              )} />
            </Route>

            {/* Catch all - Redirect to Auth or Dashboard based on token */}
            <Route path="*" element={<Navigate to={localStorage.getItem('skillroute_token') ? "/dashboard" : "/"} replace />} />
          </Routes>
        </BrowserRouter>
      </div>
    </TranslationProvider>
  );
}

// Wrappers to use hooks inside router
const LandingPageWrapper = ({ showNav, showHero }: { showNav: boolean; showHero: boolean }) => {
  const navigate = useNavigate();
  return <LandingPage onStart={() => navigate('/auth')} showContent={showHero} showNav={showNav} />;
};

const AuthWrapper = ({ onAuth }: { onAuth: (email: string) => void }) => {
  const navigate = useNavigate();
  return <Auth onBack={() => navigate('/')} onAuth={onAuth} />;
};
