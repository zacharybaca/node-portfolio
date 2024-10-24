const express = require('express');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
const path = require('path');
const PORT = 3000;
const { projects } = require('./data.json');


const emailjs = require("@emailjs/nodejs");

//Set App To Equal Express Function
const app = express();

//Set Up View Engine For Express
app.set('view engine', 'pug');

//Route To Serve Static Images
app.use('/static', express.static(path.join(__dirname, 'public')));

//Middleware To Read Incoming Data as JSON
app.use(express.json());

//Middleware To Read Form Data
app.use(bodyParser.urlencoded({ extended: true }));

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

// Email Server Configuration
emailjs.init({
    publicKey: "hrwzRdjpbVP720IcV",
    // Do not allow headless browsers
    blockHeadless: true,
    blockList: {
      // Block the suspended emails
      list: ['foo@emailjs.com', 'bar@emailjs.com'],
      // The variable contains the email address
      watchVariable: 'userEmail',
    },
    limitRate: {
      // Set the limit rate for the application
      id: 'app',
      // Allow 1 request per 10s
      throttle: 10000,
    },
  });

// Route For Email Server
app.post("/submit-form", (req, res) => {
  const formData = {
    name: req.body.name,
    email: req.body.email,
    message: req.body.message,
  };

  console.log(formData);
  emailjs.send("service_9kukvd9", "template_epflkrw", formData).then(
    () => {
      return res.status(200).send("Email Successfully Sent!");
    },
    (error) => {
      return res.status(error.status).send("Error: ", error.message);
    }
  );

  emailjs.send("service_9kukvd9", "template_1ei5qn6", formData).then(
    () => {
      return res.status(200).send("Reply Email Successfully Sent!");
    },
    (error) => {
      return res.status(error.status).send("Error: ", error.message);
    }
  );

  // Clear Inputs in Form
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("message").value = "";
})

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

    res.download(filePath, "software-engineer-resume.pdf", (err) => {
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