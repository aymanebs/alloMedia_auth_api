const express = require("express");
const path = require("path");
const bodyParser =require("body-parser");
const routes = require("./api/v1/routes");
const mongodb = require("./config/database");
const session = require("express-session");
const corsMiddleware = require("./api/v1/middlewares/corsMiddleware");
const morgan = require("morgan");

//extablish connection to db
mongodb();

// App creation
const app =express();

// Attach global middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure:true,
        httpOnly: false,  
        sameSite: "None"
    }
}))
app.use(corsMiddleware);
app.use(morgan("dev"));


// Attach routes
app.use("/",routes);


// Exports app
module.exports = app;

