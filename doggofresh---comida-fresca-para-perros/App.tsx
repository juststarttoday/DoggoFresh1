
import React, { useState, useContext, useEffect } from 'react';
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

export type Page = 'home' | 'about' | 'whatwedo' | 'contact' | 'account' | 'privacy' | 'login' | 'subscriptions' | 'pets' | 'profile' | 'billing';

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

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [showQuiz, setShowQuiz] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (showQuiz && currentPage === 'home') {
      setTimeout(() => {
        document.getElementById('quiz-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [showQuiz, currentPage]);

  const handleSetPage = (page: Page) => {
    if (page !== 'home') {
      setShowQuiz(false);
    }
    if (page === 'account' && !user) {
      setCurrentPage('login');
    } else {
      setCurrentPage(page);
    }
  };

  const handleStartQuiz = () => {
      setCurrentPage('home');
      setShowQuiz(true);
  };

  const handleQuizComplete = () => {
      setShowQuiz(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    if (user) {
      switch(currentPage) {
        case 'account':
          return <AccountPage setCurrentPage={setCurrentPage} />;
        case 'subscriptions':
          return <SubscriptionsPage setCurrentPage={setCurrentPage} />;
        case 'pets':
          return <PetsPage setCurrentPage={setCurrentPage} />;
        case 'profile':
          return <ProfilePage setCurrentPage={setCurrentPage} />;
        case 'billing':
          return <BillingPage setCurrentPage={setCurrentPage} />;
        case 'login':
          return <AccountPage setCurrentPage={setCurrentPage} />; // Redirect to account if logged in
      }
    }
    
    switch(currentPage) {
      case 'home':
        return <HomePage showQuiz={showQuiz} onStartQuiz={handleStartQuiz} onQuizComplete={handleQuizComplete} />;
      case 'about':
        return <AboutPage />;
      case 'whatwedo':
        return <WhatWeDoPage onStartQuiz={handleStartQuiz} />;
      case 'contact':
        return <ContactPage />;
      case 'login':
        return <LoginPage setCurrentPage={setCurrentPage} />;
      case 'privacy':
        return <PrivacyPolicyPage />;
      default:
        // If trying to access an auth-required page, redirect to login
        if (['account', 'subscriptions', 'pets', 'profile', 'billing'].includes(currentPage)) {
          return <LoginPage setCurrentPage={setCurrentPage} />;
        }
        return <HomePage showQuiz={showQuiz} onStartQuiz={handleStartQuiz} onQuizComplete={handleQuizComplete} />;
    }
  }

  return (
    <div className="min-h-screen bg-brand-cream text-brand-brown font-sans flex flex-col">
      <Header currentPage={currentPage} setCurrentPage={handleSetPage} />
      <main className="flex-grow">
        {renderPage()}
      </main>
      <FloatingChatbot />
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}

export default App;
