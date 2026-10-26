import React from 'react';
import { Book } from '../../types/book';
import { BookOpen, User, Calendar, Layers, CheckCircle2, BookmarkCheck } from 'lucide-react';

export interface BookCardProps {
  book: Book;
  isBorrowed: boolean;
  onBorrow: (bookId: string) => void;
  onReturn: (bookId: string) => void;
}

export const BookCard: React.FC<BookCardProps> = React.memo(
  ({ book, isBorrowed, onBorrow, onReturn }) => {
    const isOutOfStock = book.availableCopies <= 0;

    const getCategoryBadgeClass = (category: Book['category']) => {
      switch (category) {
        case 'CNTT':
          return 'badge-cntt';
        case 'Kinh tế':
          return 'badge-kinhte';
        case 'Ngoại ngữ':
          return 'badge-ngoaingu';
        default:
          return 'badge-default';
      }
    };

    const availabilityPercent = Math.min(
      100,
      Math.round((book.availableCopies / (book.totalCopies || 1)) * 100)
    );

    return (
      <div
        className={`book-card ${isBorrowed ? 'book-card-borrowed' : ''}`}
        data-testid={`book-card-${book.id}`}
      >
        <div className={`book-card-top-accent ${getCategoryBadgeClass(book.category)}`}>
          <div className="spine-icon-wrapper">
            <BookOpen size={18} />
          </div>
          <div className="card-top-badges">
            <span
              className={`category-badge ${getCategoryBadgeClass(book.category)}`}
              data-testid="book-category"
            >
              {book.category}
            </span>
            {isBorrowed ? (
              <span className="status-badge status-borrowing" data-testid="status-borrowing">
                <BookmarkCheck size={13} className="inline mr-1" />
                Đang mượn
              </span>
            ) : isOutOfStock ? (
              <span className="status-badge status-out-of-stock" data-testid="status-out-of-stock">
                Hết sách
              </span>
            ) : (
              <span className="status-badge status-available" data-testid="status-available">
                <CheckCircle2 size={13} className="inline mr-1" />
                Còn sách
              </span>
            )}
          </div>
        </div>

        <div className="book-card-body">
          <h3 className="book-title" data-testid="book-title" title={book.title}>
            {book.title}
          </h3>

          <div className="book-metadata">
            <div className="meta-item" data-testid="book-author">
              <User size={15} className="meta-icon" />
              <span>{book.author}</span>
            </div>

            <div className="meta-item" data-testid="book-publish-year">
              <Calendar size={15} className="meta-icon" />
              <span>Năm XB: {book.publishYear}</span>
            </div>

            <div className="meta-item meta-copies-box" data-testid="book-available-copies">
              <div className="copies-text-row">
                <div className="copies-label">
                  <Layers size={14} className="meta-icon" />
                  <span>Còn lại:</span>
                </div>
                <strong className={isOutOfStock ? 'text-danger' : 'text-primary'}>
                  {book.availableCopies}/{book.totalCopies} bản
                </strong>
              </div>
              <div className="mini-stock-bar">
                <div
                  className={`mini-stock-fill ${isOutOfStock ? 'stock-empty' : 'stock-active'}`}
                  style={{ width: `${availabilityPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="book-card-actions">
          {isBorrowed ? (
            <button
              type="button"
              className="btn btn-warning btn-full"
              data-testid="return-button"
              onClick={() => onReturn(book.id)}
            >
              <BookOpen size={16} />
              <span>Trả sách</span>
            </button>
          ) : (
            <button
              type="button"
              className={`btn btn-primary btn-full ${isOutOfStock ? 'btn-disabled' : ''}`}
              data-testid="borrow-button"
              disabled={isOutOfStock}
              onClick={() => onBorrow(book.id)}
            >
              <BookOpen size={16} />
              <span>{isOutOfStock ? 'Hết bản' : 'Mượn sách'}</span>
            </button>
          )}
        </div>
      </div>
    );
  }
);

BookCard.displayName = 'BookCard';
export default BookCard;
