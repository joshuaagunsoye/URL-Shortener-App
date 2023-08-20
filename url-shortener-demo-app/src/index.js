import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {initializeApp} from "firebase/app"

const root = ReactDOM.createRoot(document.getElementById("root"));

const firebaseConfig = {
  apiKey: "AIzaSyDirvrNpzQlEr2Kd2aUKnhHSOG3_P-Ny8U",
  authDomain: "urlshortenerdemo-129bf.firebaseapp.com",
  projectId: "urlshortenerdemo-129bf",
  storageBucket: "urlshortenerdemo-129bf.appspot.com",
  messagingSenderId: "275058385999",
  appId: "1:275058385999:web:2b01553a7b31d6f8e9f63a",
  measurementId: "G-GD4YKB5L8L"
};

initializeApp(firebaseConfig)

root.render(
  <BrowserRouter>
    {/* <React.StrictMode> */}
      <App />
    {/* </React.StrictMode> */}
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
