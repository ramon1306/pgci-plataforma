// frontend/src/index.js (Debe ser similar a esto)
import React from 'react';
import ReactDOM from 'react-dom/client'; // <-- Debe usar createRoot
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);