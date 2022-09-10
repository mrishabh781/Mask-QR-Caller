import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'react-qr-code';
import { Link, useNavigate, useLocation } from "react-router-dom";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import { Card, CardActionArea, CardActions, CardContent, createStyles, Divider, makeStyles, Paper, Stack, styled } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Loader } from '../helpers/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { toggleLoader } from '../slices/loaderSlice';
import { setSnackbar } from '../slices/snackbarSlice';
import axios from 'axios';
import { API_URL } from '../constants/UrlConstants';
import authHeader from "../services/auth-header";
import AuthService from '../services/auth.service';
import { capitalizeFirstLetter } from '../helpers/other';
import DownloadForOfflineRoundedIcon from '@mui/icons-material/DownloadForOfflineRounded';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function HomePage({ }) {

    const dispatch = useDispatch();

    const loadingState = useSelector((state) => state.loader.value.home_page == 'loading')

    const [qrValue, setQrValue] = useState("");

    const [userData, setUserData] = useState({});

    const isFirstRender = useRef(true);


    function downloadSVGAsPNG(e) {
        const canvas = document.createElement("canvas");
        const svg = document.querySelector('#qr-gen');
        const base64doc = btoa(unescape(encodeURIComponent(svg.outerHTML)));
        const w = parseInt(svg.getAttribute('width'));
        const h = parseInt(svg.getAttribute('height'));
        const img_to_download = document.createElement('img');
        img_to_download.src = 'data:image/svg+xml;base64,' + base64doc;
        console.log(w, h);
        img_to_download.onload = function () {
            canvas.setAttribute('width', w);
            canvas.setAttribute('height', h);
            const context = canvas.getContext("2d");
            //context.clearRect(0, 0, w, h);
            context.drawImage(img_to_download, 0, 0, w, h);
            const dataURL = canvas.toDataURL('image/png');
            if (window.navigator.msSaveBlob) {
                window.navigator.msSaveBlob(canvas.msToBlob(), "qrmaskcaller.png");
                e.preventDefault();
            } else {
                const a = document.createElement('a');
                const my_evt = new MouseEvent('click');
                a.download = 'qrmaskcaller.png';
                a.href = dataURL;
                a.dispatchEvent(my_evt);
                dispatch(setSnackbar(true, "success", "QR Downloaded Successfully."))
            }
            //canvas.parentNode.removeChild(canvas);
        }
    }


    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            if (AuthService.getCurrentUser()) {
                dispatch(toggleLoader({ resource: 'home_page', loading_state: 'loading' }));
                axios
                    .get(API_URL + "/api/v1/profile", { headers: authHeader() })
                    .then((response) => {
                        if (response?.data?.data) {
                            setQrValue(window.location.origin + '/scanner/' + response?.data?.data?.qr_uuid)
                            setUserData(response?.data?.data)
                            dispatch(toggleLoader({ resource: 'home_page', loading_state: 'loaded' }));
                        }
                    }).catch(err => {
                        dispatch(toggleLoader({ resource: 'home_page', loading_state: 'loaded' }));
                    });
            }
        }
    }, [])

    return (
        <>
            <Loader resource="home_page" />
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
                            <h2 className="text-lg font-semibold text-indigo-600">We at Gupshup respect your privacy.</h2>
                        </div>

                        <Card sx={{ maxWidth: 345 }} variant="outlined">
                            <CardActionArea>
                                <div className="flex justify-center mt-4">
                                    <QRCode value={qrValue} id="qr-gen" />
                                </div>
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        Hi, {capitalizeFirstLetter(userData.first_name + " " + userData.last_name)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                       Don't worry !! We keep your details private, your privacy is our atmost priority.
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                            <Divider></Divider>
                            <div className='my-4'>
                                <Stack
                                    direction="row"
                                    divider={<Divider orientation="vertical" flexItem />}
                                    justifyContent="center"
                                    alignItems="center"
                                    spacing={{ xs: 2, sm: 2, md: 4 }}
                                >
                                    <Item elevation={4} sx={{ backgroundColor: '#ff3964', color: 'white' }}>Total Called : {userData?.called_count}</Item>
                                    <Item elevation={4} sx={{ backgroundColor: '#ff3964', color: 'white' }}>Total Scanned : {userData?.scan_count}</Item>
                                </Stack>
                            </div>
                            <Divider></Divider>
                            <CardActions>
                                <Button key="download" size="large" variant='outlined' fullWidth color="inherit" onClick={downloadSVGAsPNG}
                                    style={{
                                        borderRadius: 5,
                                        backgroundColor: "#4f46e5",
                                        padding: "10px 15px",
                                        fontSize: "14px",
                                        color: "white"
                                    }} endIcon={<DownloadForOfflineRoundedIcon />} > Download</Button>
                            </CardActions>
                        </Card>

                    </div>
                </div>}
        </>
    )
}