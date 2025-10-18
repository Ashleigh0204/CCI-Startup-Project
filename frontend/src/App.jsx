import { useState } from 'react';
import Header from './pages/Components/Header'
import Footer from './pages/Components/Footer'
import Index from './pages/Index/Index.jsx'
import Profile from './pages/Profile/Profile.jsx'

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  // Debug logging
  console.log('App currentPage:', currentPage);

  const handleNavigate = (page) => {
    console.log('Navigating to:', page);
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'profile':
        return <Profile />;
      case 'home':
      default:
        return <Index />;
    }
  };

  return (
    <div className='flex flex-col h-screen'>
      <Header onNavigate={handleNavigate} currentPage={currentPage} />
      <main>
        {renderPage()}
      </main>
      <Footer />
    </div>
  )
}