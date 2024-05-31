import { useState } from 'react';
import {
  Button,
  Container,
  LinearProgress,
  Typography,
} from '@mui/material';
import { FileDownload } from '@mui/icons-material';

import BooksTable from '@/components/books/BooksTable';
import AddBookModal from '@/components/books/AddBookModal';
import BookSearch from '@/components/books/BookSearch';
import { useBooksContext } from '@/context/BooksProvider';
import ExportBooksModal from '@/components/books/ExportBooksModal';

export default function Books() {
  const { isFetching, books } = useBooksContext();

  const [showExport, setShowExport] = useState(false);

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant='h3' sx={{ mb: 3, fontWeight: 700 }}>
        Books List
      </Typography>
      <BookSearch />
      <AddBookModal />
      <ExportBooksModal
        open={showExport}
        onClose={() => setShowExport(false)}
      />
      {isFetching
        ? <LinearProgress />
        : (
          <>
            <BooksTable />
            {!!books.length && (
              <Button
                variant="contained"
                color="secondary"
                sx={{ mt: 2, py: 1.25, px: 3 }}
                startIcon={<FileDownload />}
                onClick={() => setShowExport(true)}
              >
                Export List
              </Button>
            )}
          </>
        )}
    </Container>
  );
}
