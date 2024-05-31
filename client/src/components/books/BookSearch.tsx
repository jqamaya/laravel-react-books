import { useCallback, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  TextField,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
} from '@mui/icons-material';

import { useBooksContext } from '@/context/BooksProvider';

export default function BookSearch() {
  const { updateBooks, isFetching } = useBooksContext();
  const [searchKeyword, setSearchKeyword] = useState('');

  const {
    setShowModal,
  } = useBooksContext();

  const handleSearch = useCallback(async () => {
    updateBooks({
      keyword: searchKeyword,
    });
  }, [searchKeyword, updateBooks]);

  const handleReset = () => {
    setSearchKeyword('');
    updateBooks();
  };

  const handleAdd = () => {
    setShowModal(true);
  }

  return (
    <Box display="flex" justifyContent="space-between" mb={3}>
      <Box display="flex">
        <TextField
          label="Search"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          sx={{
            minWidth: 400,
            '& .MuiOutlinedInput-input': {
              // py: 1.25,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }
          }}
        />
        <Button
          variant="outlined"
          color="info"
          onClick={handleSearch}
          sx={{ marginLeft: 1.5 }}
          startIcon={isFetching ? <CircularProgress size={18} /> : <SearchIcon />}
          disabled={isFetching || !searchKeyword}
        >
          Search
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleReset}
          sx={{
            marginLeft: 1.5,
            px: 4,
          }}
          startIcon={isFetching ? <CircularProgress color="secondary" size={18} /> : null}
          disabled={isFetching}
        >
          Reset
        </Button>
      </Box>
      <Button
        variant="contained"
        onClick={handleAdd}
        fullWidth={false}
        sx={{ px: 3 }}
      >
        <AddIcon sx={{ mr: 1.25 }} />
        Add Book
      </Button>
    </Box>
  );
}
