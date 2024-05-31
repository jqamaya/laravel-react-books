import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

import { Book } from "@/types/Book";

export type FetchBooksParams = {
  keyword?: string;
};

export default function useBooks() {
  const [isFetching, setFetching] = useState(true);

  const fetchBooks = async ({ keyword } : FetchBooksParams) => {
    setFetching(true);
    try {
      const queryParams = keyword ? `?keyword=${keyword}` :'';
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}books${queryParams}`,
      );
      setFetching(false);
      return { data: data?.data || [] };
    } catch (err) {
      setFetching(false);
      return { err };
    }
  }
  return {
    isFetching,
    fetchBooks,
  };
};

export const useCreateBook = () => {
  return useMutation({
    mutationFn: async (book: Book) => {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}books`,
        book,
      );
      return data;
    },
  });
}

export const useEditBook = () => {
  return useMutation({
    mutationFn: async (book: Book) => {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API_URL}books/${book.id}`,
        book,
      );
      return data;
    },
  });
}

export const useDeleteBook = () => {
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await axios.delete(
        `${process.env.REACT_APP_API_URL}books/${id}`,
      );
      return res.data;
    },
  });
}
