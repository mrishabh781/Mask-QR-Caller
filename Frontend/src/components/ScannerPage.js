import React, { useState } from 'react';
import QRCode from 'react-qr-code';
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import { Card, CardActionArea, CardActions, CardContent, createStyles, makeStyles } from '@mui/material';
import Typography from '@mui/material/Typography';

export default function ScannerPage({ }) {

    const [qrValue, setQrValue] = useState("sdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdf");
    const { uuid } = useParams();

//     const useStyles = makeStyles((theme) =>
//   createStyles({
//     root: {
//       display: "flex",
//       flexWrap: "wrap",
//       "& > *": {
//         margin: theme.spacing(3),
//       },
//     },
//   })
// );

// const classes = useStyles();

    return (
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
                    <h1>Welcome to Mask QR Caller !!</h1>
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
                    <CardActions className='text-center'>
                        <Button key="call_customer" size="medium" variant='outlined' color="inherit" onClick={() => {}} 
                          style={{
                            borderRadius: 5,
                            backgroundColor: "#21b6ae",
                            padding: "5px 15px",
                            fontSize: "12px"
                        }} >Call</Button>
                        <Button key="notify" size="medium" variant='outlined' color="inherit" onClick={() => {}} 
                          style={{
                            borderRadius: 5,
                            backgroundColor: "#7c3aed",
                            padding: "5px 15px",
                            fontSize: "12px"
                        }} >Notify</Button>
                    </CardActions>
                </Card>
            </div>
        </div>
    )
}