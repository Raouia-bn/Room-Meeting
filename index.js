const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const ejsLayouts = require('express-ejs-layouts');
const session = require('express-session'); 
const path = require('path'); 
const passport = require('passport'); 


const cookieParser = require('cookie-parser');


require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(ejsLayouts);
app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(cookieParser());

app.use(passport.initialize());
app.use(passport.session());

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/login', (req, res) => {
    res.render('login');
});
app.get('/Addrooms', (req, res) => {
    res.render('./Room/addRoom');
});
app.get('/listrooms', (req, res) => {
    res.render('./Room/listRoom');
});
app.get('/fullcalendar/main.css', (req, res) => {
    res.set('Content-Type', 'text/css');
    res.sendFile(path.join(__dirname, 'node_modules', '@fullcalendar', 'main.css'));
  });
  
  app.get('/fullcalendar/main.js', (req, res) => {
    res.set('Content-Type', 'text/javascript');
    res.sendFile(path.join(__dirname, 'node_modules', '@fullcalendar', 'main.js'));
  });
  
app.get('/', (req, res) => {
    res.send('hello social media app');
});
// Montez vos routes ici
app.use('/api/auth', authRoutes);
app.use('/api/crudRoom', roomRoutes);
app.use('/api/crudReservation', reservationRoutes);

mongoose.connect(process.env.CONNECTION_STRING, {
    
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error;"));
db.once("open", function () {
    console.log("database connected successfully..");
});

app.listen(process.env.PORT, () => {
    console.log(`app listening on port ${process.env.PORT}`);
});
