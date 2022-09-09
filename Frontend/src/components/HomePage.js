import React, { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import { Link, useNavigate, useLocation } from "react-router-dom";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import { Card, CardActionArea, CardActions, CardContent, createStyles, makeStyles } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Loader } from '../helpers/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { toggleLoader } from '../slices/loaderSlice';
import { setSnackbar } from '../slices/snackbarSlice';

export default function HomePage({ }) {

    const dispatch = useDispatch();
    const loadingState = useSelector((state) => state.loader.value.home_page == 'loading')

    const [qrValue, setQrValue] = useState("sdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdf");

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
            }
            //canvas.parentNode.removeChild(canvas);
        }
    }


// useEffect(() => {
//     setTimeout(() => {
//         // dispatch(toggleLoader({ resource: 'home_page', loading_state: 'loading' }));
//         // dispatch(setSnackbar(true, "success", "Customer Added Successfully."))
//     }, 5000)
// }, [])


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
            <br></br>
            <div className="flex justify-center flex-col" style={{ fontFamily: 'sans-serif' }}>
                <div className="flex justify-center my-4">
                    <h1>Mask QR Caller</h1>
                </div>

                <Card sx={{ maxWidth: 345 }} variant="outlined">
                    <CardActionArea>
                        <div className="flex justify-center mt-4">
                            <QRCode value={qrValue} id="qr-gen" />
                        </div>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                QR Mask Caller
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Download this QR Code for future reference, Also to be contacted in emergency scenarios.
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        <Button key="download" size="small" variant='outlined' color="inherit"  onClick={downloadSVGAsPNG} >Download</Button>
                    </CardActions>
                </Card>
            </div>
        </div>}
        </>
    )
}