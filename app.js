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
});


app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/project/:id', (req, res) => {
    const projectId = req.params.id;
    res.render('project', {"project_id": projectId});
});

app.listen(3000, () => {
    console.log('The application is running on localhost:3000');
})