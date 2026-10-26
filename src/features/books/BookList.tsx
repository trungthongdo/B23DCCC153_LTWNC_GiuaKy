import React, { useEffect, useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchBooks,
  borrowBook,
  returnBook,
  clearWarningMessage,
} from './booksSlice';
import { useFilterStore } from '../../store/filterStore';
import { useDebounce } from '../../hooks/useDebounce';
import BookCard from './BookCard';
import BookFilter from './BookFilter';
import BorrowedBooksBanner from './BorrowedBooksBanner';
import { AlertTriangle, AlertCircle, RefreshCw, Loader2, BookOpen } from 'lucide-react';

export const BookList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, borrowedBookIds, status, error, warningMessage } = useAppSelector(
    (state) => state.books
  );

  const { searchTerm, category } = useFilterStore();
  const debouncedSearchTerm = useDebounce<string>(searchTerm, 300);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchBooks(false));
    }
  }, [dispatch, status]);

  const handleBorrow = useCallback(
    (bookId: string) => {
      dispatch(borrowBook(bookId));
    },
    [dispatch]
  );

  const handleReturn = useCallback(
    (bookId: string) => {
      dispatch(returnBook(bookId));
    },
    [dispatch]
  );

  const filteredBooks = useMemo(() => {
    return items.filter((book) => {
      const matchesCategory = category === 'Tất cả' || book.category === category;
      const cleanSearch = debouncedSearchTerm.trim().toLowerCase();
      const matchesSearch =
        cleanSearch === '' ||
        book.title.toLowerCase().includes(cleanSearch) ||
        book.author.toLowerCase().includes(cleanSearch);

      return matchesCategory && matchesSearch;
    });
  }, [items, debouncedSearchTerm, category]);

  useEffect(() => {
    if (warningMessage) {
      const timer = setTimeout(() => {
        dispatch(clearWarningMessage());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [warningMessage, dispatch]);

  return (
    <div className="library-studio-container">
      {warningMessage && (
        <div className="alert alert-warning" role="alert" data-testid="warning-alert">
          <div className="alert-content">
            <AlertTriangle className="alert-icon" size={20} />
            <span>{warningMessage}</span>
          </div>
          <button
            type="button"
            className="alert-close-btn"
            onClick={() => dispatch(clearWarningMessage())}
            title="Đóng thông báo"
          >
            ✕
          </button>
        </div>
      )}

      <div className="library-dual-layout">
        <aside className="library-sidebar-area">
          <BorrowedBooksBanner onReturn={handleReturn} />
          <BookFilter />
        </aside>

        <section className="library-main-area">
          {status === 'loading' && (
            <div className="loading-state" data-testid="loading-state">
              <Loader2 className="spinner-icon" size={40} />
              <h3>Đang tải danh mục sách...</h3>
              <p>Đang kết nối tới hệ thống thư viện khoa (độ trễ giả lập 500ms)</p>
            </div>
          )}

          {status === 'failed' && (
            <div className="error-state" data-testid="error-state">
              <AlertCircle className="error-icon" size={48} />
              <h3>Không thể tải danh sách sách!</h3>
              <p className="error-message">{error}</p>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => dispatch(fetchBooks(false))}
              >
                <RefreshCw size={16} />
                <span>Thử lại ngay</span>
              </button>
            </div>
          )}

          {status === 'succeeded' && (
            <div className="books-section">
              <div className="books-section-header">
                <div>
                  <h2>
                    Kho sách chuyên ngành{' '}
                    <span className="books-count-badge">({filteredBooks.length} cuốn)</span>
                  </h2>
                  <p className="books-subhead">
                    Đang xem: <strong>{category}</strong>
                    {debouncedSearchTerm && (
                      <span> • Từ khoá: "<strong>{debouncedSearchTerm}</strong>"</span>
                    )}
                  </p>
                </div>
              </div>

              {filteredBooks.length === 0 ? (
                <div className="empty-results">
                  <BookOpen size={48} className="empty-icon" />
                  <h3>Không tìm thấy cuốn sách nào</h3>
                  <p>
                    Không có cuốn sách nào khớp với từ khoá hoặc thể loại đang chọn. Hãy thử tìm
                    kiếm với từ khoá khác!
                  </p>
                </div>
              ) : (
                <div className="book-grid">
                  {filteredBooks.map((book) => {
                    const isBorrowed = borrowedBookIds.includes(book.id);
                    return (
                      <BookCard
                        key={book.id}
                        book={book}
                        isBorrowed={isBorrowed}
                        onBorrow={handleBorrow}
                        onReturn={handleReturn}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default BookList;
