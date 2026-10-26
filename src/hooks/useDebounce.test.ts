import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce Hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('trì hoãn cập nhật giá trị sau 300ms với fake timers', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: 'React', delay: 300 },
      }
    );

    expect(result.current).toBe('React');

    rerender({ value: 'TypeScript', delay: 300 });

    expect(result.current).toBe('React');

    act(() => {
      jest.advanceTimersByTime(150);
    });
    expect(result.current).toBe('React');

    act(() => {
      jest.advanceTimersByTime(150);
    });

    expect(result.current).toBe('TypeScript');
  });
});
