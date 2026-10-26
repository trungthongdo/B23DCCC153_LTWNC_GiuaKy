import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Book, isApiSuccess, isApiError } from '../../types/book';
import { fetchBooksApi } from '../../api/booksApi';

export interface BooksState {
  items: Book[];
  borrowedBookIds: string[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  warningMessage: string | null;
}

export const initialState: BooksState = {
  items: [],
  borrowedBookIds: [],
  status: 'idle',
  error: null,
  warningMessage: null,
};

export const fetchBooks = createAsyncThunk<Book[], boolean | undefined, { rejectValue: string }>(
  'books/fetchBooks',
  async (shouldFail = false, { rejectWithValue }) => {
    const response = await fetchBooksApi(shouldFail);
    if (isApiSuccess(response)) {
      return response.data;
    }
    if (isApiError(response)) {
      return rejectWithValue(response.error);
    }
    return rejectWithValue('Không thể tải danh sách sách từ hệ thống');
  }
);

export const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    borrowBook: (state, action: PayloadAction<string>) => {
      const bookId = action.payload;
      const book = state.items.find((b) => b.id === bookId);
      if (book && book.availableCopies > 0 && !state.borrowedBookIds.includes(bookId)) {
        book.availableCopies -= 1;
        state.borrowedBookIds.push(bookId);
        state.warningMessage = null;
      }
    },
    returnBook: (state, action: PayloadAction<string>) => {
      const bookId = action.payload;
      const book = state.items.find((b) => b.id === bookId);
      const index = state.borrowedBookIds.indexOf(bookId);
      if (index !== -1) {
        if (book) {
          book.availableCopies += 1;
        }
        state.borrowedBookIds.splice(index, 1);
        state.warningMessage = null;
      }
    },
    setWarningMessage: (state, action: PayloadAction<string | null>) => {
      state.warningMessage = action.payload;
    },
    clearWarningMessage: (state) => {
      state.warningMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBooks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action: PayloadAction<Book[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? 'Đã xảy ra lỗi khi kết nối máy chủ';
      });
  },
});

export const { borrowBook, returnBook, setWarningMessage, clearWarningMessage } = booksSlice.actions;

export default booksSlice.reducer;
