const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const roomRoutes = require('./routes/roomRoutes');
require('dotenv').config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/', (req, res) => {
    res.send('hello social media app');
})


mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error;"));
db.once("open", function () {
    console.log("database connected successfully..");
});
app.use('/api/auth', authRoutes);
app.use('/api', roomRoutes);
app.listen(process.env.PORT, () => {
    console.log(`app listening on port ${process.env.PORT}`);
});
