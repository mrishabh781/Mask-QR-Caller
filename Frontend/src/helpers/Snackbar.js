import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Snackbar from '@mui/material/Snackbar';
import { setSnackbar } from "../slices/snackbarSlice";
import Alert from '@mui/material/Alert';
import { useMobileViewport } from "./mobileViewPort";

const CustomizedSnackbars = () => {
  const isMobile = useMobileViewport();
  const classes = {}
  const dispatch = useDispatch();
  const snackbarOpen = useSelector(state => state.snackbar.snackbarOpen);
  const snackbarType = useSelector(state => state.snackbar.snackbarType);
  const snackbarMessage = useSelector(state => state.snackbar.snackbarMessage);
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(setSnackbar(false, snackbarType, snackbarMessage));
  };
  
  return (
    <div className={classes.root}>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={isMobile ? { vertical: 'top', horizontal: 'center' } : { vertical: 'top', horizontal: 'right' }}
        sx={{ top: { xs: 100, sm: 100, lg: 100 } }}

      >
        <Alert
          elevation={6}
          variant="filled"
          onClose={handleClose}
          severity={snackbarType}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CustomizedSnackbars;
