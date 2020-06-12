require('dotenv').config();
const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const favicon = require('serve-favicon');

// initialize serve-favicon
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

// dotenv file settings
const PORT = process.env.PORT || 80;
const mongoUrl = process.env.DATABASE;

// Import Models
require('./models/useremail.js');
require('./models/upload.js');

// Body Parser
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
// Serving Public folder
app.use(express.static('public'))

// Serving view enging
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// MONGODB setup
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Database has been connected");
});

// Imports Routers
const indexRouter = require('./routers/index.js');
app.use('/', indexRouter);




app.listen(PORT, () => console.log(`Application is running Port@=> ${PORT}`));