import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import App from './App';

const Modal = ({ onClose }) => (
    <div className="App">
        <div className="modal-content">
            <h2>Welcome to the BS3 community.</h2>
            <p>This app will ask to use your location data to confirm that you are in BS3.</p>
            <p>It's optional but without it you will not be able to vote or post.</p>
            <p>You are free to remain anonymous and your location data will never be stored.</p>
            <button onClick={onClose}>OK</button>
        </div>
    </div>
);

export default function AppWrapper() {
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
        return <Modal onClose={handleCloseModal} />;
    }

    if (loading) {
        return <div>Checking location...</div>; 
    }

    return <App />;
}