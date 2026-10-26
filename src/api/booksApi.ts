import { Book, ApiResponse } from '../types/book';

export const initialBooks: Book[] = [
  {
    id: 'book-001',
    title: 'Lập trình Web Nâng Cao với React & TypeScript',
    author: 'TS. Nguyễn Văn A',
    category: 'CNTT',
    publishYear: 2024,
    availableCopies: 5,
    totalCopies: 5,
  },
  {
    id: 'book-002',
    title: 'Cấu trúc Dữ liệu và Giải thuật Hiện đại',
    author: 'PGS. Trần Đình B',
    category: 'CNTT',
    publishYear: 2023,
    availableCopies: 2,
    totalCopies: 4,
  },
  {
    id: 'book-003',
    title: 'Kiến trúc Hệ thống Phân tán & Microservices',
    author: 'Martin Kleppmann',
    category: 'CNTT',
    publishYear: 2022,
    availableCopies: 0,
    totalCopies: 3,
  },
  {
    id: 'book-004',
    title: 'Trí tuệ Nhân tạo và Ứng dụng Học sâu',
    author: 'Lê Hoàng C',
    category: 'CNTT',
    publishYear: 2024,
    availableCopies: 3,
    totalCopies: 3,
  },
  {
    id: 'book-005',
    title: 'Kinh tế Vi mô Ứng dụng',
    author: 'GS. N. Gregory Mankiw',
    category: 'Kinh tế',
    publishYear: 2021,
    availableCopies: 4,
    totalCopies: 6,
  },
  {
    id: 'book-006',
    title: 'Quản trị Tài chính Doanh nghiệp',
    author: 'Phạm Thị D',
    category: 'Kinh tế',
    publishYear: 2023,
    availableCopies: 1,
    totalCopies: 2,
  },
  {
    id: 'book-007',
    title: 'Nguyên lý Marketing Hiện đại',
    author: 'Philip Kotler',
    category: 'Kinh tế',
    publishYear: 2022,
    availableCopies: 0,
    totalCopies: 4,
  },
  {
    id: 'book-008',
    title: 'Khởi nghiệp Tinh gọn (The Lean Startup)',
    author: 'Eric Ries',
    category: 'Kinh tế',
    publishYear: 2020,
    availableCopies: 2,
    totalCopies: 3,
  },
  {
    id: 'book-009',
    title: 'Tiếng Anh Chuyên ngành Công nghệ Thông tin',
    author: 'Eric H. Glendinning',
    category: 'Ngoại ngữ',
    publishYear: 2023,
    availableCopies: 6,
    totalCopies: 6,
  },
  {
    id: 'book-010',
    title: 'IELTS Academic Writing & Speaking Masterclass',
    author: 'Rachel Mitchell',
    category: 'Ngoại ngữ',
    publishYear: 2024,
    availableCopies: 3,
    totalCopies: 5,
  },
  {
    id: 'book-011',
    title: 'Ngữ pháp Tiếng Anh Thực hành Toàn diện',
    author: 'Raymond Murphy',
    category: 'Ngoại ngữ',
    publishYear: 2022,
    availableCopies: 0,
    totalCopies: 2,
  },
  {
    id: 'book-012',
    title: 'Giao tiếp Tiếng Nhật Thương mại N3 - N2',
    author: 'Yamada Kenji',
    category: 'Ngoại ngữ',
    publishYear: 2023,
    availableCopies: 4,
    totalCopies: 4,
  },
];

export function fetchBooksApi(shouldFail: boolean = false): Promise<ApiResponse<Book[]>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (shouldFail) {
        resolve({
          ok: false,
          error: 'Lỗi kết nối máy chủ thư viện: Không thể tải danh mục sách. Vui lòng thử lại!',
        });
      } else {
        resolve({
          ok: true,
          data: JSON.parse(JSON.stringify(initialBooks)),
        });
      }
    }, 500);
  });
}
