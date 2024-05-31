import {
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Book } from "@/types/Book";
import useBooks, { FetchBooksParams } from "@/hooks/useBooks";

export interface Context {
  isFetching: boolean;
  books: Book[];
  setBooks: (books: Book[]) => void;
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  selectedBook?: Book;
  setSelectedBook: (book: Book | undefined) => void;
  updateBooks: (params?: FetchBooksParams) => void;
  searchKeyword: string;
  setSearchKeyword: (keyword: string) => void;
}
const BooksContext = createContext({
  isFetching: true,
  books: [] as Book[],
  setBooks: (books: Book[]) => {},
  showModal: false,
  setShowModal: (show: boolean) => {},
  setSelectedBook: (book: Book | undefined) => {},
  updateBooks: (params?: FetchBooksParams) => {},
  searchKeyword: '',
  setSearchKeyword: (keyword: string) => {},
});

export const BooksProvider = ({ children }: PropsWithChildren) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book>();
  const [searchKeyword, setSearchKeyword] = useState('');
  const { fetchBooks, isFetching } = useBooks();

  const getBooks = useCallback(async (params?: FetchBooksParams) => {
    const res = await fetchBooks(params || {});
    setBooks(res?.data || []);
  }, [fetchBooks]);

  useEffect(() => {
    getBooks({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({
      isFetching,
      books,
      setBooks,
      showModal,
      setShowModal,
      selectedBook,
      setSelectedBook,
      updateBooks: getBooks,
      searchKeyword,
      setSearchKeyword,
    }),
    [
      isFetching,
      books,
      showModal,
      setShowModal,
      selectedBook,
      setSelectedBook,
      getBooks,
      searchKeyword,
      setSearchKeyword,
    ]
  );

  return (
    <BooksContext.Provider value={value}>
      {children}
    </BooksContext.Provider>
  );
}

export const useBooksContext = () => useContext(BooksContext) as Context;