import { Middleware } from '@reduxjs/toolkit';
import { borrowBook, setWarningMessage } from './booksSlice';

export const borrowLimitMiddleware: Middleware = (store) => (next) => (action) => {
  if (borrowBook.match(action)) {
    const state = store.getState() as {
      books: {
        borrowedBookIds: string[];
        items: Array<{ id: string; availableCopies: number }>;
      };
    };

    const currentBorrowed = state.books.borrowedBookIds;
    const bookId = action.payload;

    if (currentBorrowed.length >= 3) {
      store.dispatch(
        setWarningMessage(
          '⚠️ Cảnh báo giới hạn mượn: Bạn chỉ được mượn tối đa 3 cuốn cùng lúc! Vui lòng trả sách đang mượn trước khi mượn cuốn mới.'
        )
      );
      return;
    }

    if (currentBorrowed.includes(bookId)) {
      store.dispatch(
        setWarningMessage('ℹ️ Thông báo: Bạn đang mượn cuốn sách này rồi, không thể mượn thêm bản thứ hai!')
      );
      return;
    }

    const targetBook = state.books.items.find((b) => b.id === bookId);
    if (!targetBook || targetBook.availableCopies <= 0) {
      store.dispatch(
        setWarningMessage('⚠️ Thông báo: Cuốn sách này đã hết bản sẵn sàng cho mượn!')
      );
      return;
    }
  }

  return next(action);
};
