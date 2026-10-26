import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import BookList from './features/books/BookList';
import { Loader2 } from 'lucide-react';
import './index.css';

const StatsPage = lazy(() => import('./pages/StatsPage'));

export const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <BrowserRouter>
          <div className="app-layout">
            <Navbar />
            <main className="main-content">
              <Suspense
                fallback={
                  <div className="loading-state suspense-loading">
                    <Loader2 className="spinner-icon" size={36} />
                    <p>Đang tải trang Thống kê...</p>
                  </div>
                }
              >
                <Routes>
                  <Route path="/" element={<BookList />} />
                  <Route path="/stats" element={<StatsPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </main>
            <footer className="app-footer">
              <div className="footer-content">
                <p>
                  <strong>Mini Library</strong> — Hệ thống tra cứu & mượn trả sách thư viện khoa CNTT
                </p>
                <p className="footer-sub">
                  Bài kiểm tra giữa kỳ Lập trình Web Nâng Cao • Sinh viên: <strong>B23DCCC153</strong>
                </p>
              </div>
            </footer>
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
