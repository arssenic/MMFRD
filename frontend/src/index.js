import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';      // optional, for styling (create-react-app includes it)
import App from './App';

// This is the root DOM node where your whole React app gets injected
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
