import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './i118n';
import App from './App';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './components/Admin/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import SmoothScroll from './components/SmoothScroll/SmoothScroll';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <AuthProvider>
        <ThemeProvider>
          <SmoothScroll>
            <App />
          </SmoothScroll>
        </ThemeProvider>
      </AuthProvider>
    </HelmetProvider>
  </React.StrictMode>
);
