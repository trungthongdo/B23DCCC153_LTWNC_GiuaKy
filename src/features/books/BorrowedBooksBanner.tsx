import React from 'react';
import { useAppSelector } from '../../app/hooks';
import { Bookmark, AlertCircle, BookOpen, RotateCcw, Check } from 'lucide-react';
import { Book } from '../../types/book';

interface BorrowedBooksBannerProps {
  onReturn: (bookId: string) => void;
}

export const BorrowedBooksBanner: React.FC<BorrowedBooksBannerProps> = ({ onReturn }) => {
  const { items, borrowedBookIds } = useAppSelector((state) => state.books);

  const borrowedBooks: Book[] = borrowedBookIds
    .map((id) => items.find((b) => b.id === id))
    .filter((b): b is Book => b !== undefined);

  const count = borrowedBooks.length;
  const isFull = count >= 3;

  return (
    <div className={`borrowed-banner ${isFull ? 'banner-full' : ''}`}>
      <div className="borrowed-banner-header">
        <div className="borrowed-banner-title">
          <Bookmark className="banner-icon" size={18} />
          <div>
            <h3>Sách đang mượn</h3>
            <p className="banner-subtitle">Tối đa 3 cuốn cùng lúc</p>
          </div>
        </div>

        <div className="borrowed-counter-badge">
          <span className="counter-current">{count}</span>
          <span className="counter-max">/3</span>
        </div>
      </div>

      <div className="borrow-slots-indicator">
        {[0, 1, 2].map((idx) => {
          const isSlotOccupied = idx < count;
          return (
            <div
              key={idx}
              className={`borrow-slot ${isSlotOccupied ? 'slot-occupied' : 'slot-empty'}`}
              title={isSlotOccupied ? `Cuốn thứ ${idx + 1}` : 'Vị trí trống'}
            >
              {isSlotOccupied ? <Check size={12} /> : <span>{idx + 1}</span>}
            </div>
          );
        })}
      </div>

      {isFull && (
        <div className="borrowed-limit-alert">
          <AlertCircle size={15} />
          <span>Đã đạt giới hạn 3 cuốn. Hãy trả sách trước khi mượn tiếp!</span>
        </div>
      )}

      {count === 0 ? (
        <div className="borrowed-empty">
          <BookOpen size={20} className="opacity-40" />
          <p>Chưa mượn cuốn nào</p>
        </div>
      ) : (
        <div className="borrowed-list">
          {borrowedBooks.map((book) => (
            <div key={book.id} className="borrowed-item">
              <div className="borrowed-item-info">
                <span className="borrowed-item-category">{book.category}</span>
                <span className="borrowed-item-title" title={book.title}>
                  {book.title}
                </span>
                <span className="borrowed-item-author">{book.author}</span>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-return"
                onClick={() => onReturn(book.id)}
                title="Trả sách này"
              >
                <RotateCcw size={13} />
                <span>Trả</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BorrowedBooksBanner;
