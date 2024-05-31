import { useEffect, useState } from 'react';
import {
  TextField,
  Typography,
} from '@mui/material';

import { useBooksContext } from '@/context/BooksProvider';
import { useCreateBook, useEditBook } from '@/hooks/useBooks';
import { useInput } from '@/hooks/useInput';
import ModalComponent from '../Modal';

export default function AddBookModal() {
  const {
    selectedBook,
    updateBooks,
    showModal,
    setShowModal,
    setSelectedBook,
  } = useBooksContext();
  const createMutation = useCreateBook();
  const editMutation = useEditBook();

  const [errors, setErrors] = useState({
    generic: '',
    title: [],
    author: [],
  });
  const titleProps = useInput('');
  const authorProps = useInput('');

  useEffect(() => {
    titleProps.update(selectedBook?.title || '');
    authorProps.update(selectedBook?.author || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBook]);

  const handleSave = () => {
    let book = {
      title: titleProps.value,
      author: authorProps.value,
    };
    let mutation;

    if (selectedBook) {
      book = {
        ...selectedBook,
        ...book,
      }
      mutation = editMutation;
    } else {
      mutation = createMutation;
    }
    mutation.mutate(book, {
      onSuccess: (data) => {
        if (data?.data) {
          updateBooks();
          handleClose();
        }
        if (data?.errors) {
          setErrors(data?.errors);
        }
      },
      onError: (err) => {
        setErrors({
          ...errors,
          generic: err.message,
        });
      }
    })
  }

  const handleClose = () => {
    setShowModal(false);
    selectedBook && setSelectedBook(undefined);
    titleProps.reset();
    authorProps.reset();
    setErrors({
      generic: '',
      title: [],
      author: [],
    });
  };

  return (
    <ModalComponent
      open={showModal}
      onClose={handleClose}
      primaryText="Save"
      secondaryText="Cancel"
      handlePrimaryButton={handleSave}
      handleSecondaryButton={handleClose}
    >
      <>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {`${selectedBook ? 'Edit' : 'Add New'} Book`}
        </Typography>
        {!!errors?.generic && (
          <Typography
            variant="h6"
            color="error"
            sx={{ whiteSpace: "pre-wrap", mb: 2 }}
          >
            {errors?.generic}
          </Typography>
        )}
        <TextField
          {...titleProps}
          label="Title"
          placeholder="Title"
          fullWidth
          variant="outlined"
          sx={{ mb: 2 }}
          error={!!errors.title?.length}
          helperText={errors.title?.join('\n')}
          disabled={!!selectedBook}
        />
        <TextField
          {...authorProps}
          label="Author"
          placeholder="Author"
          fullWidth
          variant="outlined"
          sx={{ mb: 3 }}
          error={!!errors.author?.length}
          helperText={errors.author?.join('\n')}
        />
      </>
    </ModalComponent>
  );
}
