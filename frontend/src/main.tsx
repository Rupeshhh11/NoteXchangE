import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// @ts-ignore: CSS modules type declarations not present in this environment
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
