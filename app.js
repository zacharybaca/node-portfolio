const express = require('express');
const favicon = require('serve-favicon');
const path = require('path');
const PORT = 3000;
const { projects } = require('./data.json');

//Set App To Equal Express Function
const app = express();

//Set Up View Engine For Express
app.set('view engine', 'pug');

//Route To Serve Static Images
app.use('/static', express.static(path.join(__dirname, 'public')));

//Middleware To Read Incoming Data as JSON
app.use(express.json());

//Middleware To Render Favicon
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.png')));


//Route to Take User To Index Page and Give Route Access To Project Data
app.get('/', (req, res) => {
    res.locals = projects;
    res.render('index', { projects });
});

//Route to Take User To About Page
app.get('/about', (req, res) => {
    res.render('about');
});

//Route to Take User To Specific Project Based on Project ID
//Error Handler For Pages or Projects That Don't Exist
app.get('/project/:id', (req, res, next) => {
    const projectId = req.params.id;
    const project = projects.find(({id}) => id === +projectId);
    if (project) {
        res.render('project', { project });
    } else {
        const err = new Error();
        err.status = 404;
        err.message = 'This Project Doesn\'t Exist!'
        next(err);
    }
});

//Middleware To Catch Errors

//Error Handler To Catch 404 Status Errors


//Error Handler For Global Errors That Don't Match Undefined Routes
app.use((err, req, res, next) => {
    if (err) {
        err.status = err.status || 500;
        err.message = err.message || 'An Error Had Occurred on the Server!';
        console.log(`Status Code: ${err.status}, Message: ${err.message}`);
    }
    
})


//Route to Download Resume
app.get("/download/:filename", (req, res) => {
    const filePath = __dirname + "/public/documents/" + req.params.filename;

    res.download(filePath, "resume.pdf", (err) => {
        if (err) {
            res.send({
                error: err,
                msg: "Problem downloading file"
            })
        }
    });
});

//Route to Start Server For Express App
app.listen(process.env.PORT || PORT, (err) => {
    if (!err) {
        console.log(`Server is Running Correctly, and is Listening on port ${PORT}`);
    } else {
        console.log('An Error Has Occurred and the Server Cannot Start', err);
    }
});