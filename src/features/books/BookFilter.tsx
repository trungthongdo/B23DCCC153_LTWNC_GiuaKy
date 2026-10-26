import React from 'react';
import { useFilterStore, CategoryFilter } from '../../store/filterStore';
import { useAppSelector } from '../../app/hooks';
import { Search, X, Filter, Code, TrendingUp, Languages, Grid } from 'lucide-react';
import { BookCategory } from '../../types/book';

const categories: CategoryFilter[] = ['Tất cả', 'CNTT', 'Kinh tế', 'Ngoại ngữ'];

export const BookFilter: React.FC = () => {
  const { searchTerm, category, setSearchTerm, setCategory, resetFilter } = useFilterStore();
  const books = useAppSelector((state) => state.books.items);

  const getCategoryCount = (cat: CategoryFilter) => {
    if (cat === 'Tất cả') return books.length;
    return books.filter((b) => b.category === (cat as BookCategory)).length;
  };

  const getCategoryIcon = (cat: CategoryFilter) => {
    switch (cat) {
      case 'CNTT':
        return <Code size={15} />;
      case 'Kinh tế':
        return <TrendingUp size={15} />;
      case 'Ngoại ngữ':
        return <Languages size={15} />;
      default:
        return <Grid size={15} />;
    }
  };

  return (
    <div className="filter-panel-card">
      <div className="panel-card-header">
        <Filter size={16} className="text-emerald" />
        <h4>Bộ lọc & Tìm kiếm</h4>
      </div>

      <div className="search-box-wrapper">
        <div className="search-input-group">
          <Search className="search-icon" size={17} />
          <input
            type="text"
            className="search-input"
            placeholder="Tìm kiếm sách"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-testid="search-input"
          />
          {searchTerm && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => setSearchTerm('')}
              title="Xoá từ khoá tìm kiếm"
            >
              <X size={15} />
            </button>
          )}
        </div>
      </div>

      <div className="category-section">
        <span className="category-section-title">Chuyên ngành</span>
        <div className="category-vertical-list">
          {categories.map((cat) => {
            const isActive = category === cat;
            return (
              <button
                key={cat}
                type="button"
                className={`category-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setCategory(cat)}
                data-testid={`category-filter-${cat}`}
              >
                <div className="category-nav-left">
                  <span className="category-nav-icon">{getCategoryIcon(cat)}</span>
                  <span className="category-nav-name">{cat}</span>
                </div>
                <span className="category-nav-badge">{getCategoryCount(cat)}</span>
              </button>
            );
          })}
        </div>

        {(searchTerm !== '' || category !== 'Tất cả') && (
          <button
            type="button"
            className="btn-reset-filter-full"
            onClick={resetFilter}
          >
            <X size={14} />
            <span>Đặt lại bộ lọc</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default BookFilter;
