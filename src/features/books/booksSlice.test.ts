import booksReducer, {
  initialState,
  borrowBook,
  returnBook,
  setWarningMessage,
  clearWarningMessage,
  fetchBooks,
  BooksState,
} from './booksSlice';
import { Book } from '../../types/book';

describe('booksSlice Reducer', () => {
  const sampleBook1: Book = {
    id: 'b1',
    title: 'Lập trình Web Nâng Cao',
    author: 'Tác giả 1',
    category: 'CNTT',
    publishYear: 2024,
    availableCopies: 3,
    totalCopies: 3,
  };

  const sampleBook2: Book = {
    id: 'b2',
    title: 'Kinh tế Vi mô',
    author: 'Tác giả 2',
    category: 'Kinh tế',
    publishYear: 2023,
    availableCopies: 0,
    totalCopies: 2,
  };

  const sampleState: BooksState = {
    items: [sampleBook1, sampleBook2],
    borrowedBookIds: ['b1'],
    status: 'succeeded',
    error: null,
    warningMessage: null,
  };

  test('trả về state ban đầu khi nhận action không xác định', () => {
    expect(booksReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  test('xử lý fetchBooks.pending cập nhật status thành loading', () => {
    const action = { type: fetchBooks.pending.type };
    const state = booksReducer(initialState, action);
    expect(state.status).toBe('loading');
    expect(state.error).toBeNull();
  });

  test('xử lý fetchBooks.fulfilled cập nhật status thành succeeded và lưu danh sách sách', () => {
    const action = {
      type: fetchBooks.fulfilled.type,
      payload: [sampleBook1, sampleBook2],
    };
    const state = booksReducer(initialState, action);
    expect(state.status).toBe('succeeded');
    expect(state.items).toHaveLength(2);
    expect(state.items[0].id).toBe('b1');
    expect(state.error).toBeNull();
  });

  test('xử lý fetchBooks.rejected cập nhật status thành failed và lưu thông báo lỗi', () => {
    const action = {
      type: fetchBooks.rejected.type,
      payload: 'Lỗi kết nối máy chủ',
    };
    const state = booksReducer(initialState, action);
    expect(state.status).toBe('failed');
    expect(state.error).toBe('Lỗi kết nối máy chủ');
  });

  test('xử lý borrowBook giảm số bản còn lại 1 và thêm vào danh sách đang mượn', () => {
    const stateWithAvailableBook: BooksState = {
      items: [
        {
          id: 'b3',
          title: 'IELTS Master',
          author: 'Rachel',
          category: 'Ngoại ngữ',
          publishYear: 2024,
          availableCopies: 5,
          totalCopies: 5,
        },
      ],
      borrowedBookIds: [],
      status: 'succeeded',
      error: null,
      warningMessage: null,
    };

    const nextState = booksReducer(stateWithAvailableBook, borrowBook('b3'));
    expect(nextState.items[0].availableCopies).toBe(4);
    expect(nextState.borrowedBookIds).toContain('b3');
  });

  test('xử lý returnBook tăng số bản còn lại 1 và xoá khỏi danh sách đang mượn', () => {
    const nextState = booksReducer(sampleState, returnBook('b1'));
    expect(nextState.items[0].availableCopies).toBe(4);
    expect(nextState.borrowedBookIds).not.toContain('b1');
  });

  test('xử lý setWarningMessage và clearWarningMessage chính xác', () => {
    const stateWithWarning = booksReducer(
      initialState,
      setWarningMessage('Đã mượn tối đa 3 cuốn')
    );
    expect(stateWithWarning.warningMessage).toBe('Đã mượn tối đa 3 cuốn');

    const stateCleared = booksReducer(stateWithWarning, clearWarningMessage());
    expect(stateCleared.warningMessage).toBeNull();
  });
});
