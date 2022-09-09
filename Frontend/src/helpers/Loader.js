import React, { useEffect } from "react";
import CircularProgress from '@mui/material/CircularProgress';
import { useSelector } from "react-redux";

  
  export default function CircularIndeterminate() {
    const classes = {};
  
    return (
      <div>
        <CircularProgress className={classes.progress} color="secondary" />
      </div>
    );
  }

export const Loader = (props) => {
    const loading_states = useSelector((state) => { return state.loader.value });

    // looking for loading/dispatch
    useEffect(() => {
        //console.log("[LD2]:",loading_states)
    }, [loading_states]);

    return (
        <>{
            loading_states[props.resource] !== 'loaded' &&
               <div className={` stack-box stack-top ${props.extraClasses}`}>
                <div className={`hide stack-box stack-top ${props.extraClasses}`} style={{ 'background': 'transparent' }}></div>
                <div className="stack-box stack-top2ss" style={{ display: 'flex', justifyContent: 'center' }}>
                    <div className='loader2'
                        style={{ backgroundColor: 'transparent', padding2: '10px', borderRadius: '1rem' }}>
                        <div className="loader2-spinner cc" style={{ backgroundColor: 'white', padding2: '10px', borderRadius: '1rem' }}>
                            <div className="loader2-spinner2" >
                                <CircularIndeterminate />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        }</>
    )
}