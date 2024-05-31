import { useCallback, useState } from 'react';
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from '@mui/material';
import { Close, Delete, Edit } from '@mui/icons-material';
import { visuallyHidden } from '@mui/utils';
import { lightGreen, red } from '@mui/material/colors';
import _ from 'lodash';

import { useBooksContext } from '@/context/BooksProvider';
import { Book } from '@/types/Book';
import { useDeleteBook } from '@/hooks/useBooks';
import ModalComponent from '../Modal';

type Order = 'asc' | 'desc';

const COLUMNS = [
  {
    key: 'title',
    label: 'Title',
    sort: true,
  },
  {
    key: 'author',
    label: 'Author',
    sort: true,
  },
  {
    key: 'actions',
    label: 'Actions',
    sort: false,
  },
]

export default function BooksTable() {
  const {
    books,
    selectedBook,
    setSelectedBook,
    setShowModal,
    updateBooks,
    setBooks,
  } = useBooksContext();

  const [order, setOrder] = useState<Order>();
  const [orderBy, setOrderBy] = useState<typeof COLUMNS[number]['key']>('');
  const [message, setMessage] = useState<{ type: 'error' | 'success' | '', value: string }>({
    type: '',
    value: '',
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const deleteMutation = useDeleteBook();

  const handleDelete = useCallback(() => {
    if (!selectedBook?.id) {
      setShowDeleteModal(false);
      setMessage({
        type: 'error',
        value: `Error: No book selected`,
      });
      return;
    }

    deleteMutation.mutate(1, {
      onSuccess: (data) => {
        updateBooks();
        setShowDeleteModal(false);
        setMessage({
          type: 'success',
          value: `Success: "${selectedBook.title}" has been deleted.`,
        })
      },
      onError: (err) => {
        console.log(err)
        setShowDeleteModal(false);
        setMessage({
          type: 'error',
          value: `Error: "${selectedBook.title}" was not deleted due to an error: ${err.message}`,
        });
      }
    })
  }, [selectedBook, deleteMutation, updateBooks]);

  const onCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleSort = useCallback((column: typeof COLUMNS[number]['key']) => {
    const isAsc = orderBy === column && order === 'asc';
    const newOrder = isAsc ? 'desc' : 'asc';
    setBooks(_.orderBy(books, column, newOrder));
    setOrder(newOrder);
    setOrderBy(column);
  }, [order, orderBy, setBooks, books]);

  const renderBooks = () => (
    books?.map((book: Book, index: number) => (
      <TableRow key={book.id || index}>
        <TableCell>{book.title}</TableCell>
        <TableCell>{book.author}</TableCell>
        <TableCell>
          <IconButton onClick={() => {
            setSelectedBook(book);
            setShowModal(true);
          }}>
            <Edit />
          </IconButton>
          <IconButton onClick={() => {
            setSelectedBook(book);
            setShowDeleteModal(true);
          }}>
            <Delete />
          </IconButton>
        </TableCell>
      </TableRow>
    ))
  );

  return (
    <>
      <ModalComponent
        open={showDeleteModal}
        onClose={onCloseDeleteModal}
        primaryText="Yes, Delete"
        secondaryText="Cancel"
        handlePrimaryButton={handleDelete}
        handleSecondaryButton={onCloseDeleteModal}
        primaryButtonProps={{
          color: 'error',
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ mb: 2 }}>
            Confirm Delete
          </Typography>
          <Typography variant="h6" sx={{ mb: 2, whiteSpace: "pre-wrap" }}>
            {`Are you sure you want to delete this book?\n${selectedBook?.title}`}
          </Typography>
        </Box>
      </ModalComponent>

      {!!message.value && (
        <Box sx={{
          bgcolor: message.type === 'success' ? lightGreen[50] : red[50],
          p: 1.5,
          mb: 2,
          borderRadius: 1.5,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Typography
            variant="body1"
            color={`${message.type}.dark`}
            fontWeight={500}
            sx={{ whiteSpace: "pre-wrap" }}
          >
            {message.value}
          </Typography>
          <IconButton onClick={() => setMessage({ type: '', value: '' })}>
            <Close color={message.type || 'success'} />
          </IconButton>
        </Box>
      )}

      <TableContainer component={Paper}>
        <Table>
          <colgroup>
            <col width="50%" />
            <col width="40%" />
            <col width="10%" />
          </colgroup>
          <TableHead>
            <TableRow>
              {COLUMNS.map(({ key, label, sort }) => (
                <TableCell
                  key={key}
                  sx={{ fontSize: 14 }}
                  sortDirection={orderBy === key ? order : false}
                >
                  {sort
                    ? (
                      <TableSortLabel
                        active={orderBy === key}
                        direction={orderBy === key ? order : 'asc'}
                        onClick={() => handleSort(key)}
                      >
                        {label}
                        {orderBy === key ? (
                          <Box component="span" sx={visuallyHidden}>
                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    )
                    : <>{label}</>}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {books.length 
              ? renderBooks()
              : (
                <TableCell colSpan={3} align="center">
                  No books found.
                </TableCell>
              )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
