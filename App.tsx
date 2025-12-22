import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Contact from './pages/Contact';
import CookiePolicy from './pages/Cookie';

export type PageView = 'home' | 'privacy' | 'terms' | 'contact' | 'cookie';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageView>('home');

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.page) {
        setCurrentPage(event.state.page);
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (page: PageView) => {
    window.scrollTo(0, 0);
    setCurrentPage(page);
    // Add history entry so back button works naturally
    window.history.pushState({ page }, '', `/${page === 'home' ? '' : '#' + page}`);
  };

  switch (currentPage) {
    case 'privacy':
      return <Privacy onBack={() => navigate('home')} />;
    case 'terms':
      return <Terms onBack={() => navigate('home')} />;
    case 'contact':
      return <Contact onBack={() => navigate('home')} />;
    case 'cookie':
      return <CookiePolicy onBack={() => navigate('home')} />;
    case 'home':
    default:
      return <Home onNavigate={navigate} />;
  }
};

export default App;