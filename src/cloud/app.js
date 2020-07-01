/*
 * Advanced Cloud Code Example
 */

import express from "express";
import cors from "cors";
import routes from "./routes";
const app = express();

app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// We use this one only for the SashiDo demo app
// If you want to integrate the code in existing Express app
// please remove or change this line
app.get("/", (req, res) => res.redirect("/moderator"));


// API Routes
app.use("/api", routes.api);

// Moderator Route / React App
app.use("/moderator", routes.moderator);

export default app;
