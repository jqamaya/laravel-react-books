import { useCallback, useState } from 'react';
import {
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import { FileDownload } from '@mui/icons-material';

import ModalComponent from '../Modal';
import { useBooksContext } from '@/context/BooksProvider';
import Dropdown from '../Dropdown';
import { downloadCSV, downloadXML } from '@/utils/downloadFile';
import { Book } from '@/types/Book';

const DataExportItems = [
  { value: undefined, label: 'Select Data to Export' },
  { value: 'title', label: 'Titles Only' },
  { value: 'author', label: 'Authors Only' },
  { value: 'both', label: 'Titles and Authors' },
];

const FileTypes = [
  { value: undefined, label: 'Select File Type' },
  { value: 'csv', label: 'CSV' },
  { value: 'xml', label: 'XML' },
];

type Props = {
  open: boolean;
  onClose: () => void;
}
export default function ExportBooksModal({ open, onClose }: Props) {
  const { books } = useBooksContext();

  const [error, setError] = useState('');
  const [dataExport, setDataExport] = useState<typeof DataExportItems[number]['value']>();
  const [fileType, setFileType] = useState<typeof FileTypes[number]['value']>();

  const handleChange = (type: 'data' | 'type') => (event: SelectChangeEvent<unknown>) => {
    const { value = '' } = event.target;
    if (value && typeof value === 'string') {
      if (type === 'data') {
        setDataExport(value);
      } else {
        setFileType(value);
      }
    }
  };

  const handleExport = useCallback(() => {
    if (!dataExport && !fileType) return;
    let data: Array<Partial<Book>> = [];
    switch (dataExport) {
      case 'title':
        data = books.map(({ id, title }) => ({ id, title }));
        break;
      case 'author':
        data = books.map(({ id, author }) => ({ id, author }));
        break;
      case 'both':
        data = books.map(({ id, title, author }) => ({ id, title, author }));
        break;
      default:
        data = books;
        break;
    }
    const fileName = `books-${dataExport}-${Date.now()}`;
    try {
      if (fileType === 'csv') {
        downloadCSV({ data, fileName });
      } else {
        downloadXML({ data, fileName });
      }
    } catch (err) {
      setError('An unexpected error occurred while exporting data.');
    }
  }, [dataExport, fileType, books]);

  return (
    <ModalComponent
      open={open}
      onClose={onClose}
      primaryText="Export"
      primaryButtonProps={{
        color: 'secondary',
        startIcon: <FileDownload />,
        disabled: !dataExport || !fileType,
      }}
      handlePrimaryButton={handleExport}
      secondaryButtonProps={{ color: 'secondary' }}
      handleSecondaryButton={onClose}
    >
      <>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Export List
        </Typography>
        {!!error && (
          <Typography
            variant="h6"
            color="error"
            sx={{ whiteSpace: "pre-wrap", mb: 2 }}
          >
            {error}
          </Typography>
        )}
        <Dropdown
          label="Data to Export"
          items={DataExportItems}
          containerProps={{
            sx: { mb: 2 },
          }}
          value={dataExport || ''}
          onChange={handleChange('data')}
        />
        <Dropdown
          label="File Type"
          items={FileTypes}
          containerProps={{
            sx: { mb: 3 },
          }}
          value={fileType || ''}
          onChange={handleChange('type')}
        />
      </>
    </ModalComponent>
  );
}
