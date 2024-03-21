const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');

require('dotenv').config();
const app = express();
app.use(express.json());



app.get('/', (req, res) => {
    res.send('hello social media app');
});

app.get('/raouia',(req,res)=>{
    //return res.status(200).send('hello chabeb !')
    res.render('register')
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
app.listen(process.env.PORT, () => {
    console.log(`app listening on port ${process.env.PORT}`);
});
