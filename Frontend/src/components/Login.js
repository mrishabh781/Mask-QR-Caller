import { useState } from 'react';
import { loginFields } from "../constants/formFields";
import FormAction from "./FormAction";
import FormExtra from "./FormExtra";
import Input from "./Input";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthService from "../services/auth.service";
import { useDispatch } from 'react-redux';
import { setSnackbar } from '../slices/snackbarSlice';

const fields=loginFields;
let fieldsState = {};
fields.forEach(field=>fieldsState[field.id]='');

export default function Login({ }){
    const dispatch = useDispatch();
    const [loginState,setLoginState]=useState(fieldsState);
    const navigate = useNavigate();
    const location = useLocation();

    const handleChange=(e)=>{
        setLoginState({...loginState,[e.target.id]:e.target.value})
    }

    const handleSubmit=(e)=>{
        e.preventDefault();
        authenticateUser();
    }

    //Handle Login API Integration here
    const authenticateUser = async () =>{
        try {
            await AuthService.login(loginState).then((response) => {
                if(response) {
                navigate("/home");
                window.location.reload();
                }
              },
              (error) => {
                dispatch(setSnackbar(true, "error", `Please Enter Valid Credentials.`))
                console.log(error);
              }
            ).catch(err => { 
                dispatch(setSnackbar(true, "error", `${err?.response?.data?.detail}`))
             });
          } catch (err) {
            console.log(err);
          }
         }
    

    return(
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="-space-y-px">
            {
                fields.map(field=>
                        <Input
                            key={field.id}
                            handleChange={handleChange}
                            value={loginState[field.id]}
                            labelText={field.labelText}
                            labelFor={field.labelFor}
                            id={field.id}
                            name={field.name}
                            type={field.type}
                            isRequired={field.isRequired}
                            placeholder={field.placeholder}
                    />
                
                )
            }
        </div>

        <FormExtra/>
        <FormAction handleSubmit={handleSubmit} text="Login"/>
      </form>
    )
}