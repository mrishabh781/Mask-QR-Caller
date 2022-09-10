import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import { Link, useNavigate, useLocation, useParams, Navigate } from "react-router-dom";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import { Card, CardActionArea, CardActions, CardContent, createStyles, Divider, makeStyles } from '@mui/material';
import Typography from '@mui/material/Typography';
import CallRoundedIcon from '@mui/icons-material/CallRounded';
import MessageRoundedIcon from '@mui/icons-material/MessageRounded';
import AuthService from '../services/auth.service';
import { useDispatch, useSelector } from 'react-redux';
import { toggleLoader } from '../slices/loaderSlice';
import { setSnackbar } from '../slices/snackbarSlice';
import { API_URL } from '../constants/UrlConstants';
import axios from 'axios';
import authHeader from '../services/auth-header';
import { Loader } from '../helpers/Loader';
import { capitalizeFirstLetter } from '../helpers/other';
import { useMobileViewport } from '../helpers/mobileViewPort';


export default function ScannerPage({ }) {
    
    const dispatch = useDispatch();
    const [qrValue, setQrValue] = useState("");
    const [userData, setUserData] = useState("Unknown")
    const [operation, setOperation] = useState({});
    const { uuid } = useParams();
    const navigate = useNavigate();
    const isFirstRender = useRef(true);
    const loadingState = useSelector((state) => state.loader.value.home_page == 'loading')
    const SRNumberRef = useRef();
    const isMobile = useMobileViewport();

    useEffect(() => {
        if(isFirstRender.current) {
        isFirstRender.current = false;
        dispatch(toggleLoader({ resource: 'home_page', loading_state: 'loading' }));
        try {
            axios
                .get(API_URL + `/api/v1/scanner?uuid=${uuid}`)
                .then((response) => {
                    if (response?.data?.data) {
                        setOperation(response?.data?.data)
                        setUserData(response?.data?.display_name)
                        setQrValue(window.location.pathname?.split('/')[2])
                        dispatch(toggleLoader({ resource: 'home_page', loading_state: 'loaded' }));
                    }
                }).catch(err => {
                    dispatch(toggleLoader({ resource: 'home_page', loading_state: 'loaded' }));
                    AuthService.logout();
                    navigate('/');
                    window.location.reload();
                });
        } catch (e) {
            dispatch(toggleLoader({ resource: 'home_page', loading_state: 'loaded' }));
        }
    }
    }, [])

    const callOperation = () => {
        if(isMobile) {
        const link = SRNumberRef.current;
        if(link && link.href) {
            link.click();
        }
        } else {
            dispatch(setSnackbar(true, "warning", "Try Calling on Mobile Device !!"))
        }
        // open dialpad
    }

    const notifyOperation = () => {
        dispatch(setSnackbar(true, "success", "A Text Message has been Sent !!"))
        // axios
        //     .post(API_URL + `/api/v1/notify/`, { operation })
        //     .then((response) => {
        //         if (response?.data?.data) {
        //             dispatch(setSnackbar(true, "success", "Call Placed Successfully."))
        //             dispatch(toggleLoader({ resource: 'home_page', loading_state: 'loaded' }));
        //         }
        //     }).catch(err => {
        //         dispatch(toggleLoader({ resource: 'home_page', loading_state: 'loaded' }));
        //     });
    }

    return (
        <>
            <Loader resource="home_page" />
            <a href={`tel:${operation}`} ref={SRNumberRef} hidden></a>
            {!loadingState &&
            <div className="mb-10">
                <div className="flex justify-center">
                    <img
                        alt=""
                        className="h-30 w-30"
                        src="https://ik.imagekit.io/gupshup/revamp/assets/v3/images/new-home-page/logo-gupshup.svg?ik-sdk-version=react-1.1.1" />
                </div>
                {/* <br></br> */}
                <div className="flex justify-center flex-col" style={{ fontFamily: 'sans-serif' }}>
                    <div className="flex justify-center my-4">
                        <h2 className="text-lg font-semibold text-indigo-600">One-on-one. With Everyone.</h2>
                    </div>

                    <Card sx={{ maxWidth: 345 }} variant="outlined">
                        <CardActionArea>
                            <div className="flex justify-center mt-4">
                                <QRCode value={qrValue} id="qr-gen" />
                            </div>
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Contact : {capitalizeFirstLetter(userData)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Keep this QR Code for future reference, Also to be contacted in emergency scenarios.
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                        <Divider></Divider>
                        <CardActions className='text-center'>
                            <Button key="call_customer" size="medium" variant='outlined' fullWidth color="inherit" onClick={callOperation}
                                style={{
                                    borderRadius: 5,
                                    backgroundColor: "#21b6ae",
                                    padding: "10px 15px",
                                    fontSize: "13px",
                                    color: "white"
                                }} startIcon={<CallRoundedIcon />} > Call</Button>
                            <Button key="notify" size="medium" variant='outlined' fullWidth color="inherit" onClick={notifyOperation}
                                style={{
                                    borderRadius: 5,
                                    backgroundColor: "#4f46e5",
                                    padding: "10px 15px",
                                    fontSize: "13px",
                                    color: "white"
                                }} startIcon={<MessageRoundedIcon />} > Just Notify ?</Button>
                        </CardActions>
                    </Card>
                </div>
            </div>}
        </>
    )
}