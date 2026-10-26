export type BookCategory = 'CNTT' | 'Kinh tế' | 'Ngoại ngữ';

export interface Book {
  id: string;
  title: string;
  author: string;
  category: BookCategory;
  publishYear: number;
  availableCopies: number;
  totalCopies: number;
}

export type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export function isApiSuccess<T>(response: ApiResponse<T>): response is { ok: true; data: T } {
  return response.ok === true;
}

export function isApiError<T>(response: ApiResponse<T>): response is { ok: false; error: string } {
  return response.ok === false;
}

export type BookDisplaySummary = Pick<Book, 'id' | 'title' | 'author' | 'category' | 'availableCopies'>;
export type CategoryBookCount = Record<BookCategory, number>;
export type ReadonlyBook = Readonly<Book>;
export type BookFilterCriteria = Partial<Pick<Book, 'title' | 'author' | 'category'>>;
export type BorrowedBook = Omit<Book, 'totalCopies'> & {
  borrowedDate: string;
};
