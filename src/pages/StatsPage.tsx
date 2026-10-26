import React from 'react';
import { useAppSelector, useAppDispatch } from '../app/hooks';
import { returnBook } from '../features/books/booksSlice';
import { BookCategory, CategoryBookCount } from '../types/book';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  BookOpen,
  BookmarkCheck,
  Library,
  Layers,
  ArrowLeft,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const StatsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, borrowedBookIds } = useAppSelector((state) => state.books);

  const categoryTitleCounts: CategoryBookCount = {
    CNTT: items.filter((b) => b.category === 'CNTT').length,
    'Kinh tế': items.filter((b) => b.category === 'Kinh tế').length,
    'Ngoại ngữ': items.filter((b) => b.category === 'Ngoại ngữ').length,
  };

  const categoryTotalCopies: CategoryBookCount = {
    CNTT: items
      .filter((b) => b.category === 'CNTT')
      .reduce((sum, b) => sum + b.totalCopies, 0),
    'Kinh tế': items
      .filter((b) => b.category === 'Kinh tế')
      .reduce((sum, b) => sum + b.totalCopies, 0),
    'Ngoại ngữ': items
      .filter((b) => b.category === 'Ngoại ngữ')
      .reduce((sum, b) => sum + b.totalCopies, 0),
  };

  const categoryAvailableCopies: CategoryBookCount = {
    CNTT: items
      .filter((b) => b.category === 'CNTT')
      .reduce((sum, b) => sum + b.availableCopies, 0),
    'Kinh tế': items
      .filter((b) => b.category === 'Kinh tế')
      .reduce((sum, b) => sum + b.availableCopies, 0),
    'Ngoại ngữ': items
      .filter((b) => b.category === 'Ngoại ngữ')
      .reduce((sum, b) => sum + b.availableCopies, 0),
  };

  const totalTitles = items.length;
  const totalCopies = items.reduce((sum, b) => sum + b.totalCopies, 0);
  const totalAvailable = items.reduce((sum, b) => sum + b.availableCopies, 0);

  const borrowedCount = borrowedBookIds.length;
  const borrowedBooks = borrowedBookIds
    .map((id) => items.find((b) => b.id === id))
    .filter((b) => b !== undefined);

  const categories: BookCategory[] = ['CNTT', 'Kinh tế', 'Ngoại ngữ'];

  const getCategoryColor = (cat: BookCategory) => {
    switch (cat) {
      case 'CNTT':
        return '#3b82f6';
      case 'Kinh tế':
        return '#10b981';
      case 'Ngoại ngữ':
        return '#f59e0b';
    }
  };

  return (
    <div className="stats-page">
      <div className="stats-header">
        <Link to="/" className="btn btn-outline back-link">
          <ArrowLeft size={16} />
          <span>Quay lại Thư viện</span>
        </Link>
        <div className="stats-title-group">
          <h1>
            <BarChart3 className="title-icon inline mr-2 text-primary" size={28} />
            Bảng Thống kê Hoạt động Thư viện
          </h1>
          <p className="stats-subtitle">
            Dữ liệu tổng quan về các đầu sách chuyên ngành và tình hình mượn sách của sinh viên
          </p>
        </div>
      </div>

      <div className="stats-grid-kpi">
        <div className="kpi-card">
          <div className="kpi-icon-wrapper bg-blue-subtle">
            <Library size={24} className="text-blue" />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Tổng đầu sách</span>
            <strong className="kpi-value">{totalTitles}</strong>
            <span className="kpi-hint">3 thể loại chuyên ngành</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper bg-emerald-subtle">
            <Layers size={24} className="text-emerald" />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Tổng số bản sách</span>
            <strong className="kpi-value">{totalCopies}</strong>
            <span className="kpi-hint">Trong kho thư viện</span>
          </div>
        </div>

        <div className="kpi-card highlight-card">
          <div className="kpi-icon-wrapper bg-emerald-subtle">
            <BookmarkCheck size={24} className="text-emerald" />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Sách bạn đang mượn</span>
            <strong className="kpi-value">
              {borrowedCount}
              <span className="text-muted text-sm font-normal"> / 3 cuốn</span>
            </strong>
            <span className="kpi-hint">
              {borrowedCount === 3
                ? '⚠️ Đã đạt giới hạn tối đa'
                : `Còn mượn thêm được ${3 - borrowedCount} cuốn`}
            </span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-wrapper bg-amber-subtle">
            <BookOpen size={24} className="text-amber" />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Bản sách sẵn sàng</span>
            <strong className="kpi-value">{totalAvailable}</strong>
            <span className="kpi-hint">Có thể mượn ngay</span>
          </div>
        </div>
      </div>

      <div className="stats-section card">
        <div className="section-title">
          <Sparkles size={20} className="text-primary" />
          <h2>Thống kê số đầu sách theo từng thể loại</h2>
        </div>
        <p className="text-muted section-desc">
          Số lượng đầu sách và tỉ lệ bản sách sẵn sàng theo từng chuyên ngành
        </p>

        <div className="category-stats-list">
          {categories.map((cat) => {
            const titleCount = categoryTitleCounts[cat];
            const copiesCount = categoryTotalCopies[cat];
            const availCount = categoryAvailableCopies[cat];
            const titlePercent = totalTitles > 0 ? Math.round((titleCount / totalTitles) * 100) : 0;
            const availPercent = copiesCount > 0 ? Math.round((availCount / copiesCount) * 100) : 0;

            return (
              <div key={cat} className="category-stat-row">
                <div className="stat-row-header">
                  <div className="stat-name">
                    <span
                      className="category-indicator-dot"
                      style={{ backgroundColor: getCategoryColor(cat) }}
                    />
                    <strong className="cat-title">{cat}</strong>
                  </div>
                  <div className="stat-numbers">
                    <span className="badge-stat">
                      <strong>{titleCount}</strong> đầu sách ({titlePercent}%)
                    </span>
                    <span className="badge-stat-copies">
                      Còn <strong>{availCount}</strong>/{copiesCount} bản ({availPercent}%)
                    </span>
                  </div>
                </div>

                <div className="stat-progress-bar-bg">
                  <div
                    className="stat-progress-bar-fill"
                    style={{
                      width: `${titlePercent}%`,
                      backgroundColor: getCategoryColor(cat),
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="stats-section card">
        <div className="section-title">
          <BookmarkCheck size={20} className="text-emerald" />
          <h2>Chi tiết sách bạn đang mượn ({borrowedCount}/3)</h2>
        </div>

        {borrowedBooks.length === 0 ? (
          <div className="empty-borrowed-box">
            <BookOpen size={36} className="text-muted opacity-50 mb-2" />
            <p>Hiện bạn chưa mượn cuốn sách nào từ thư viện.</p>
            <Link to="/" className="btn btn-primary mt-2">
              Khám phá sách và mượn ngay
            </Link>
          </div>
        ) : (
          <div className="borrowed-table-wrapper">
            <table className="borrowed-table">
              <thead>
                <tr>
                  <th>Tên sách</th>
                  <th>Tác giả</th>
                  <th>Thể loại</th>
                  <th>Năm XB</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {borrowedBooks.map((book) => (
                  <tr key={book.id}>
                    <td className="font-semibold">{book.title}</td>
                    <td>{book.author}</td>
                    <td>
                      <span className="category-badge-sm">{book.category}</span>
                    </td>
                    <td>{book.publishYear}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-sm btn-warning"
                        onClick={() => dispatch(returnBook(book.id))}
                        title="Trả sách này về thư viện"
                      >
                        <RotateCcw size={14} />
                        <span>Trả sách</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsPage;
