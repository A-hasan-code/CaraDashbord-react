
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "../public/css/tailwind.css";
import { Provider } from 'react-redux';
import store from './Redux/store/Store';

ReactDOM.createRoot(document.getElementById("root")).render(


    <BrowserRouter>
      <Provider store={store}>
        <ToastContainer 
         position="top-right"
  autoClose={5000}
  hideProgressBar={false}
  newestOnTop={true}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
     />
          <App />
        
      </Provider>
    </BrowserRouter>
  
);
