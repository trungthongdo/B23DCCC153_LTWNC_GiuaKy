import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookCard } from './BookCard';
import { Book } from '../../types/book';

describe('BookCard Component', () => {
  const sampleAvailableBook: Book = {
    id: 'test-book-01',
    title: 'Lập trình Web Nâng Cao với React & TypeScript',
    author: 'TS. Nguyễn Văn A',
    category: 'CNTT',
    publishYear: 2024,
    availableCopies: 5,
    totalCopies: 5,
  };

  const sampleOutOfStockBook: Book = {
    id: 'test-book-02',
    title: 'Kiến trúc Hệ thống Phân tán',
    author: 'Martin Kleppmann',
    category: 'CNTT',
    publishYear: 2022,
    availableCopies: 0,
    totalCopies: 3,
  };

  test('hiển thị đúng thông tin sách', () => {
    const handleBorrow = jest.fn();
    const handleReturn = jest.fn();

    render(
      <BookCard
        book={sampleAvailableBook}
        isBorrowed={false}
        onBorrow={handleBorrow}
        onReturn={handleReturn}
      />
    );

    expect(screen.getByTestId('book-title')).toHaveTextContent(
      'Lập trình Web Nâng Cao với React & TypeScript'
    );
    expect(screen.getByTestId('book-author')).toHaveTextContent('TS. Nguyễn Văn A');
    expect(screen.getByTestId('book-category')).toHaveTextContent('CNTT');
    expect(screen.getByTestId('book-publish-year')).toHaveTextContent('2024');
    expect(screen.getByTestId('book-available-copies')).toHaveTextContent('5/5 bản');
  });

  test('click nút Mượn gọi đúng hàm callback onBorrow với đúng id cuốn sách', async () => {
    const user = userEvent.setup();
    const handleBorrow = jest.fn();
    const handleReturn = jest.fn();

    render(
      <BookCard
        book={sampleAvailableBook}
        isBorrowed={false}
        onBorrow={handleBorrow}
        onReturn={handleReturn}
      />
    );

    const borrowBtn = screen.getByTestId('borrow-button');
    expect(borrowBtn).toBeEnabled();

    await user.click(borrowBtn);

    expect(handleBorrow).toHaveBeenCalledTimes(1);
    expect(handleBorrow).toHaveBeenCalledWith('test-book-01');
  });

  test('nút Mượn bị vô hiệu hoá khi sách đã hết bản', () => {
    const handleBorrow = jest.fn();
    const handleReturn = jest.fn();

    render(
      <BookCard
        book={sampleOutOfStockBook}
        isBorrowed={false}
        onBorrow={handleBorrow}
        onReturn={handleReturn}
      />
    );

    const borrowBtn = screen.getByTestId('borrow-button');
    expect(borrowBtn).toBeDisabled();
    expect(screen.getByTestId('status-out-of-stock')).toBeInTheDocument();
  });

  test('hiển thị nút Trả sách và click gọi đúng onReturn khi sách đang được mượn', async () => {
    const user = userEvent.setup();
    const handleBorrow = jest.fn();
    const handleReturn = jest.fn();

    render(
      <BookCard
        book={sampleAvailableBook}
        isBorrowed={true}
        onBorrow={handleBorrow}
        onReturn={handleReturn}
      />
    );

    const returnBtn = screen.getByTestId('return-button');
    expect(returnBtn).toBeInTheDocument();

    await user.click(returnBtn);
    expect(handleReturn).toHaveBeenCalledTimes(1);
    expect(handleReturn).toHaveBeenCalledWith('test-book-01');
  });
});
