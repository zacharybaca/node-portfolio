const express = require('express');
const path = require('path');
const projects = require('./data.json');

//Set App To Equal Express Function
const app = express();

//Set Up View Engine For Express
app.set('view engine', 'pug');

//Route To Serve Static Images
app.use('/static', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.locals = projects.projects;
    res.render('index');
})