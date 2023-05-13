const mongoose = require("mongoose");

require('dotenv').config('../.env');

mongoose.connect(
    process.env.DATABASE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(() => { console.log("Connected to DB") })
.catch(console.error)

const User = require('../models/User');

module.exports = User;