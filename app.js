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

app.use((req, res, next) => {
    console.log('404 called')
    res.status(404).render('index', { message: 'Page Not Found!' });
    
});

app.use((err, req, res, next) => {
    if (err) {
        console.log('Global err called');
    }
    if (err.status === 404) {
        res.status(404).render('index', { err });
    } else {
        err.message = err.message || 'Something Went Wrong On The Server!';
        res.status(err.status || 500).render('index', { err });
    }
})

//Route to Start Server For Express App
app.listen(3000, () => {
    console.log('The application is running on localhost:3000');
})