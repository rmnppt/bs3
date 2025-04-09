import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import App from './App';
import { Box, Typography, Button, Modal } from '@mui/material';

interface AppModalProps {
  onClose: () => void;
}

const AppModal: React.FC<AppModalProps> = ({ onClose }) => {
  const [showModal] = useState(true);

  return (
    <Modal
      open={showModal}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          p: 4,
          bgcolor: 'background.paper',
          borderRadius: 1,
          margin: 'auto',
          maxWidth: '500px',
          mt: '10%',
          boxShadow: 24,
        }}
      >
        <Typography id="modal-title" variant="h6" component="h2">
          Welcome to the BS3 community.
        </Typography>
        <Typography id="modal-description" sx={{ mt: 2 }}>
          Location is optional but without it you will not be able to vote or post.
          Location data will never be stored.
        </Typography>
        <Button onClick={onClose} sx={{ mt: 2 }}>
          OK
        </Button>
      </Box>
    </Modal>
  );
};

const AppWrapper: React.FC = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    if (!showModal) {
      setLoading(false);
    }
  }, [dispatch, showModal]);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  if (showModal) {
    return <AppModal onClose={handleCloseModal} />;
  }

  if (loading) {
    return <div>Checking location...</div>;
  }

  return <App />;
};

export default AppWrapper;