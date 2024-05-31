import { PropsWithChildren } from 'react';
import {
  Box,
  Button,
  ButtonProps,
  Modal,
  ModalProps,
} from '@mui/material';

export type Props = PropsWithChildren & ModalProps & {
  primaryText: string;
  primaryButtonProps?: ButtonProps;
  handlePrimaryButton: () => void;
  secondaryText?: string;
  secondaryButtonProps?: ButtonProps;
  handleSecondaryButton?: () => void;
}
export default function ModalComponent({
  open,
  onClose,
  primaryText,
  primaryButtonProps,
  handlePrimaryButton,
  secondaryText = 'Cancel',
  secondaryButtonProps,
  handleSecondaryButton,
  children,
  ...rest
}: Props) {
  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        {...rest}
      >
        <Box sx={{
          position: 'absolute' as 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 400},
          bgcolor: 'white',
          borderRadius: 2,
          boxShadow: 24,
          maxHeight: 500,
          overflowY: 'auto',
        }}>
          <Box
            p={3}
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            maxWidth="30vw"
          >
            {children}
            <Box display="flex" justifyContent="space-between">
              {secondaryText && (
                <Button
                  variant="outlined"
                  color="info"
                  fullWidth
                  onClick={handleSecondaryButton}
                  {...secondaryButtonProps}
                  sx={{ py: 1.5, mr: 2, ...secondaryButtonProps?.sx }}
                >
                  {secondaryText}
                </Button>
              )}
              <Button
                variant="contained"
                fullWidth
                onClick={handlePrimaryButton}
                {...primaryButtonProps}
                sx={{ py: 1.5, ...primaryButtonProps?.sx }}
              >
                {primaryText}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
