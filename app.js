const express = require('express');
const path = require('path');
const projects = require('./data.json');

//Set App To Equal Express Function
const app = express();

//Set Up View Engine For Express
app.set('view engine', 'pug');

//Route To Serve Static Images
app.use('/static', express.static(path.join(__dirname, 'public')));



//Route to Take User To Index Page and Give Route Access To Project Data
app.get('/', (req, res) => {
    res.locals = projects.projects;
    res.render('index');
});

//Route to Take User To About Page
app.get('/about', (req, res) => {
    res.render('about');
});

//Route to Take User To Specific Project Based on Project ID
app.get('/project/:id', (req, res, next) => {
    const projectId = req.params.id;
    if (projects[projectId]) {
        res.render('project', {project_name: projects[projectId].project_name});
    } else {
        const err = new Error();
        err.status = 404;
        err.message = 'This Project Doesn\'t Exist!'
        next(err);
    }
});

//Middleware To Catch Errors

//Error Handler To Catch 404 Status Errors

app.use((req, res, next) => {
    console.log('404 called');
    const err = new Error();
    err.status = 404;
    err.message = 'Page Not Found!';
    next(err);
});

//Error Handler For Global Errors That Don't Match Undefined Routes
app.use((err, req, res, next) => {
    if (err) {
        console.log('Global Handler Called');
        err.status = err.status || 500;
        err.message = err.message || 'An Error Had Occurred on the Server!';
        res.render('index', { status: `Status Code: ${err.status}`, message: err.message});
    }
    
})

//Route to Start Server For Express App
app.listen(3000, () => {
    console.log('The application is running on localhost:3000');
})