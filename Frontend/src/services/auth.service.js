import axios from "axios";
import { API_URL } from "../constants/UrlConstants";

const signup = (fields) => {
  return axios
    .post(API_URL + "/api/v1/signup/", fields)
    .then((response) => {
      // if (response.data.accessToken) {
      //   localStorage.setItem("user", JSON.stringify(response.data));
      // }
      return response.data;
    });
};

const login = (fields) => {
  return axios
    .post(API_URL + "/api/token/", fields)
    .then((response) => {
      if (response.data.access) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const authService = {
  signup,
  login,
  logout,
  getCurrentUser,
};

export default authService;
