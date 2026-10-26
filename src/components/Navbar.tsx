import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { fetchBooks } from '../features/books/booksSlice';
import {
  BookMarked,
  Sun,
  Moon,
  BarChart3,
  BookOpen,
  Bookmark,
  Bug,
  RefreshCw,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const dispatch = useAppDispatch();
  const borrowedCount = useAppSelector((state) => state.books.borrowedBookIds.length);
  const status = useAppSelector((state) => state.books.status);

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-brand">
          <div className="brand-icon-wrapper">
            <BookMarked size={22} className="brand-icon" />
          </div>
          <div className="brand-text">
            <span className="brand-title">Mini Library</span>
            <span className="brand-subtitle">B23DCCC153 • LTWNC Giữa Kỳ</span>
          </div>
        </NavLink>

        <nav className="nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <BookOpen size={16} />
            <span>Tra cứu & Mượn sách</span>
          </NavLink>

          <NavLink
            to="/stats"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <BarChart3 size={16} />
            <span>Thống kê</span>
          </NavLink>
        </nav>

        <div className="navbar-actions">
          <div
            className={`borrowed-badge-nav ${
              borrowedCount === 3
                ? 'badge-nav-danger'
                : borrowedCount > 0
                ? 'badge-nav-active'
                : ''
            }`}
            title="Số sách bạn đang mượn (tối đa 3 cuốn)"
          >
            <Bookmark size={14} />
            <span>Đang mượn: </span>
            <strong>{borrowedCount}/3</strong>
          </div>

          <button
            type="button"
            className="btn-demo-error"
            onClick={() => dispatch(fetchBooks(true))}
            disabled={status === 'loading'}
            title="Giả lập lỗi kết nối API"
          >
            <Bug size={14} />
            <span>Giả lập lỗi API</span>
          </button>

          <button
            type="button"
            className="btn-reload"
            onClick={() => dispatch(fetchBooks(false))}
            disabled={status === 'loading'}
            title="Tải lại danh sách sách thành công"
          >
            <RefreshCw size={14} className={status === 'loading' ? 'animate-spin' : ''} />
          </button>

          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label="Chuyển đổi giao diện sáng/tối"
            title={`Chuyển sang chế độ ${theme === 'light' ? 'Tối' : 'Sáng'}`}
          >
            {theme === 'light' ? (
              <Moon size={18} className="theme-icon moon-icon" />
            ) : (
              <Sun size={18} className="theme-icon sun-icon" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
