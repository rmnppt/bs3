import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import App from './App';
import { Box, Typography, Button, Modal } from '@mui/material';


export default function AppWrapper() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(true);
    
    const AppModal = ({ onClose }) => (
    
        <Modal
            open={showModal}
            onClose={onClose}
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
        <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Typography id="modal-title" variant="h6" component="h2">
            Welcome to the BS3 community.
        </Typography>
        <Typography id="modal-description" sx={{ mt: 2 }}>
            <p>This app will ask to use your location data to confirm that you are in BS3.</p>
            <p>It's optional but without it you will not be able to vote or post.</p>
            <p>You are free to remain anonymous and your location data will never be stored.</p>
        </Typography>
        <Button onClick={onClose} sx={{ mt: 2 }}>
            OK
        </Button>
        </Box>
        </Modal>
    );
    
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
}