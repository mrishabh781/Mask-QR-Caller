import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signupFields } from "../constants/formFields"
import FormAction from "./FormAction";
import Input from "./Input";
import AuthService from "../services/auth.service";
import { useDispatch } from 'react-redux';
import { setSnackbar } from '../slices/snackbarSlice';

const fields=signupFields;
let fieldsState={};

fields.forEach(field => fieldsState[field.id]='');

export default function Signup() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [signupState,setSignupState]=useState(fieldsState);

  const handleChange=(e)=>setSignupState({...signupState,[e.target.id]:e.target.value});

  const handleSubmit=(e)=>{
    e.preventDefault();
    createAccount()
  }

  //handle Signup API Integration here
  const createAccount=async(e)=>{
    try {
      await AuthService.signup(signupState).then(
        (response) => {
          // check for token and user already exists with 200
          //   console.log("Sign up successfully", response);
          if(response) {
          dispatch(setSnackbar(true, "success", "User Registered Successfully."))
          navigate("/");
          window.location.reload();
          }
        },
        (error) => {
          console.log(error);
        }
      );
    } catch (err) {
      dispatch(setSnackbar(true, "error", "Something went wrong !!"))
      console.log(err);
    }
  }

    return(
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="">
        {
                fields.map(field=>
                        <Input
                            key={field.id}
                            handleChange={handleChange}
                            value={signupState[field.id]}
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
          <FormAction handleSubmit={handleSubmit} text="Signup" />
        </div>

         

      </form>
    )
}