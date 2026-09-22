import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { FormPage } from './pages/FormPage';
import { IntroShowcase } from './pages/IntroShowcase';
import { ResponsesPage } from './pages/ResponsesPage';
import { SponsorsPage } from './pages/SponsorsPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { CustomPage } from './pages/CustomPage';
import { ImageModal } from './components/ImageModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import './styles/main.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught Error in Component Tree:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
    } catch (e) {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#f8fafc', background: '#0f172a', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', fontWeight: 'bold' }}>系統遭遇暫時性錯誤</h2>
          <p style={{ color: '#94a3b8', maxWidth: '600px', marginBottom: '1.5rem', lineHeight: '1.6' }}>
            可能因為本機儲存空間滿載或資料異常導致畫面無法顯示。系統已進行防護，您可以嘗試重新載入，或點擊下方按鈕重置測試資料。
          </p>
          {this.state.error && (
            <pre style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#fca5a5', padding: '1rem', borderRadius: '8px', maxWidth: '700px', overflowX: 'auto', fontSize: '0.82rem', textAlign: 'left', marginBottom: '2rem' }}>
              {this.state.error.toString()}
              {'\n'}
              {this.state.error.stack}
            </pre>
          )}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={() => window.location.reload()} style={{ padding: '0.75rem 1.5rem', background: '#3b82f6', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
              🔄 重新整理頁面
            </button>
            <button onClick={this.handleReset} style={{ padding: '0.75rem 1.5rem', background: '#ef4444', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
              🗑️ 清空快取並重置資料
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const MainAppContent = () => {
  const { activeTab, customPages = [] } = useApp();

  const renderActivePage = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'intro':
        return <IntroShowcase />;
      case 'announcements':
        return <AnnouncementsPage />;
      case 'form':
        return <FormPage />;
      case 'responses':
        return <ResponsesPage />;
      case 'sponsors':
        return <SponsorsPage />;
      case 'admin':
        return <AdminDashboard />;
      default: {
        const foundCustomPage = customPages.find(cp => cp.id === activeTab);
        if (foundCustomPage) {
          return <CustomPage page={foundCustomPage} />;
        }
        if (activeTab && (activeTab.startsWith('cp_') || activeTab.includes('_'))) {
          return <div className="page-container animate-fade-in" style={{ minHeight: '60vh', padding: '4rem 1.5rem', textAlign: 'center' }}></div>;
        }
        return <Home />;
      }
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        {renderActivePage()}
      </main>
      <ImageModal />
      <AdminLoginModal />
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <MainAppContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
