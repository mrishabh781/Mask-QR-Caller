import './App.css';
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import SignupPage from './pages/Signup';
import LoginPage from './pages/Login';
import HomePage from './components/HomePage';
import Navigation from './components/Navigation';
import ScannerPage from './components/ScannerPage';
import AboutPage from './components/AboutPage';
import HelpPage from './components/HelpPage';
import ErrorPage from './components/ErrorPage';
import CustomizedSnackbars from './helpers/Snackbar';

function App() {

  const isAuthorized = true

  return (
    <>
      {isAuthorized && <Navigation />}
      <CustomizedSnackbars />
      <div className="min-h-full h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        {/* <div className="justify-center flex w-full space-y-8"> */}
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="*" element={<ErrorPage />} />

            {isAuthorized &&
              <Route path="/scanner/:uuid" element={<ScannerPage />} />}
            {!isAuthorized &&
              <Route path="/scanner" element={<Navigate replace to="/home" />} />}
          </Routes>
        {/* </div> */}
      </div>
    </>
  );
}

export default App;
