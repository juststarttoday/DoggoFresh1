
import React, { useState, useContext, useEffect } from 'react';
import { Routes, Route, Outlet, Navigate, useLocation, Link, useNavigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PersonalizationQuiz } from './components/PersonalizationQuiz';
import { AITools } from './components/AITools';
import { Footer } from './components/Footer';
import { AboutPage } from './components/pages/AboutPage';
import { WhatWeDoPage } from './components/pages/WhatWeDoPage';
import { ContactPage } from './components/pages/ContactPage';
import { AccountPage } from './components/pages/AccountPage';
import { PrivacyPolicyPage } from './components/pages/PrivacyPolicyPage';
import { LoginPage } from './components/pages/LoginPage';
import { FloatingChatbot } from './components/FloatingChatbot';
import { AuthContext } from './contexts/AuthContext';
import { SubscriptionsPage } from './components/pages/SubscriptionsPage';
import { PetsPage } from './components/pages/PetsPage';
import { ProfilePage } from './components/pages/ProfilePage';
import { BillingPage } from './components/pages/BillingPage';

interface HomePageProps {
  showQuiz: boolean;
  onStartQuiz: () => void;
  onQuizComplete: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ showQuiz, onStartQuiz, onQuizComplete }) => {
    return (
      <>
        <Hero onStartQuiz={onStartQuiz} />
        {showQuiz && (
           <div id="quiz-section">
             <PersonalizationQuiz onQuizComplete={onQuizComplete} />
           </div>
        )}
        <AITools />
      </>
    );
};

// Layout component to wrap pages with Header and Footer
const Layout: React.FC = () => (
  <div className="min-h-screen bg-brand-cream text-brand-brown font-sans flex flex-col">
    <Header />
    <main className="flex-grow">
      <Outlet />
    </main>
    <FloatingChatbot />
    <Footer />
  </div>
);

// Protected route component
const ProtectedRoute: React.FC = () => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return <div>Cargando...</div>; // Or a spinner component
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};


function App() {
  const [showQuiz, setShowQuiz] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll to quiz when showQuiz is true
    if (showQuiz) {
      setTimeout(() => {
        document.getElementById('quiz-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [showQuiz]);
  
  useEffect(() => {
    // Hide quiz if navigating away from home
    if(location.pathname !== '/') {
        setShowQuiz(false);
    }
  }, [location.pathname]);

  const handleStartQuiz = () => {
      navigate('/');
      setShowQuiz(true);
  };

  const handleQuizComplete = () => {
      setShowQuiz(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<HomePage showQuiz={showQuiz} onStartQuiz={handleStartQuiz} onQuizComplete={handleQuizComplete} />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="whatwedo" element={<WhatWeDoPage onStartQuiz={handleStartQuiz}/>} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="privacy" element={<PrivacyPolicyPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="account" element={<AccountPage />} />
          <Route path="account/subscriptions" element={<SubscriptionsPage />} />
          <Route path="account/pets" element={<PetsPage />} />
          <Route path="account/profile" element={<ProfilePage />} />
          <Route path="account/billing" element={<BillingPage />} />
        </Route>
        
        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
}

export default App;