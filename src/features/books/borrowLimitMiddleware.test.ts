import { configureStore } from '@reduxjs/toolkit';
import booksReducer, { borrowBook, BooksState } from './booksSlice';
import { borrowLimitMiddleware } from './borrowLimitMiddleware';
import { Book } from '../../types/book';

describe('borrowLimitMiddleware', () => {
  const sampleBooks: Book[] = [
    {
      id: 'b1',
      title: 'Sách 1',
      author: 'Tác giả 1',
      category: 'CNTT',
      publishYear: 2024,
      availableCopies: 2,
      totalCopies: 2,
    },
    {
      id: 'b2',
      title: 'Sách 2',
      author: 'Tác giả 2',
      category: 'Kinh tế',
      publishYear: 2023,
      availableCopies: 1,
      totalCopies: 1,
    },
    {
      id: 'b3',
      title: 'Sách 3',
      author: 'Tác giả 3',
      category: 'Ngoại ngữ',
      publishYear: 2022,
      availableCopies: 3,
      totalCopies: 3,
    },
    {
      id: 'b4',
      title: 'Sách 4',
      author: 'Tác giả 4',
      category: 'CNTT',
      publishYear: 2024,
      availableCopies: 1,
      totalCopies: 1,
    },
    {
      id: 'b-empty',
      title: 'Sách hết bản',
      author: 'Tác giả 5',
      category: 'CNTT',
      publishYear: 2024,
      availableCopies: 0,
      totalCopies: 1,
    },
  ];

  const createTestStore = (customState?: Partial<BooksState>) => {
    const initialState: BooksState = {
      items: sampleBooks,
      borrowedBookIds: [],
      status: 'succeeded',
      error: null,
      warningMessage: null,
      ...customState,
    };

    return configureStore({
      reducer: {
        books: booksReducer,
      },
      preloadedState: {
        books: initialState,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(borrowLimitMiddleware),
    });
  };

  test('cho phép mượn sách bình thường khi chưa đủ 3 cuốn', () => {
    const store = createTestStore({ borrowedBookIds: ['b1'] });

    store.dispatch(borrowBook('b2'));

    const state = store.getState().books;
    expect(state.borrowedBookIds).toEqual(['b1', 'b2']);
    expect(state.warningMessage).toBeNull();
  });

  test('chặn mượn sách và hiển thị cảnh báo khi sinh viên đã mượn tối đa 3 cuốn', () => {
    const store = createTestStore({ borrowedBookIds: ['b1', 'b2', 'b3'] });

    store.dispatch(borrowBook('b4'));

    const state = store.getState().books;
    expect(state.borrowedBookIds).toHaveLength(3);
    expect(state.borrowedBookIds).not.toContain('b4');
    expect(state.warningMessage).toContain('tối đa 3 cuốn');
  });

  test('chặn mượn khi sinh viên cố tình mượn lại cuốn sách mình đang mượn', () => {
    const store = createTestStore({ borrowedBookIds: ['b1'] });

    store.dispatch(borrowBook('b1'));

    const state = store.getState().books;
    expect(state.borrowedBookIds).toEqual(['b1']);
    expect(state.warningMessage).toContain('đang mượn cuốn sách này rồi');
  });

  test('chặn mượn khi cuốn sách đã hết bản', () => {
    const store = createTestStore({ borrowedBookIds: [] });

    store.dispatch(borrowBook('b-empty'));

    const state = store.getState().books;
    expect(state.borrowedBookIds).toHaveLength(0);
    expect(state.warningMessage).toContain('hết bản');
  });
});
