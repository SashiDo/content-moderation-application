import "regenerator-runtime/runtime.js";

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import Parse from "parse";
import config from "./config";
import App from "./app";
import "./assets/css/styles.css";

const { SERVER_URL, APP_ID, JS_KEY, } = config;
Parse.serverURL = SERVER_URL;
Parse.initialize(APP_ID, JS_KEY);

global.Parse = Parse;
global.collectionUserImage = Parse.Object.extend("UserImage");

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById("root")
);
