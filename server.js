const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const authenticate = require('./middleware/authenticate');
const User = require('./middleware/dbconnect');

require('dotenv').config();

const port = process.env.PORT;
const saltRounds = Number(process.env.SALT_ROUNDS);


app.use(express.json());
app.use(cors({
    origin: [
        /*'https://jpxl-auth.onrender.com/',
        'http://localhost:3000',
        '216.24.57.253',*/
        '*'
    ], 
    credentials: true,
    optionsSuccessStatus: 200
}));
app.use(cookieParser());


app.get('/', (req, res) => {
    res.send('Hello World');
})

// DEBUG!!
/*app.delete('/debug-force-delete', async (req, res) => {
    let match;
    let result = [];
    let del;
    await req.body.usernames.map(async (item) => {
        match = await User.findOne({ username: { $regex: item, $options: 'i' } })
        if (match) {
            del = await User.findByIdAndDelete(match._id);
            result.push(del);
        }
    })
    
    res.json(result);
})*/

app.use('/users', require('./routes/users'));

app.listen(port, () => {
    console.log(`API is live on port ${port}!`);
})