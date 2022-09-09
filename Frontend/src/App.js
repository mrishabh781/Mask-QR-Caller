import './App.css';
import React, { useEffect, useState } from 'react';
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
import AuthService from "./services/auth.service";
import { useSelector } from 'react-redux';

function App() {

  const [isAuthorized, setisAuthorized] = useState(undefined);
  const loadingState = useSelector((state) => state.loader.value.home_page == 'loading')

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setisAuthorized(user);
    }
  }, []);
  
  return (
    <>
      {isAuthorized && <Navigation />}
      <CustomizedSnackbars />
      <div className="min-h-full h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        {/* <div className="justify-center flex w-full space-y-8"> */}
          <Routes>
            {!loadingState &&
            <Route path="*" element={<ErrorPage />} />}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/scanner/:uuid" element={<ScannerPage />} />
            {isAuthorized &&
              <>
              <Route path="/home" element={<HomePage />} />
              <Route path="/" element={<Navigate replace to="/home" />} />
              </>
            }
            {!isAuthorized &&
            <>
              {/* <Route path="/scanner" element={<Navigate replace to="/home" />} /> */}
              <Route path="/" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />  
            </>
            }
          </Routes>
        {/* </div> */}
      </div>
    </>
  );
}

export default App;
