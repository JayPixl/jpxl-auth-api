const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('./dbconnect.js');

const authenticate = async (user, callback) => {
    if (!(user.username && user.password)) return callback(undefined, 'Username or password is missing', 400);
    const dbmatch = await User.findOne({ username: { $regex: user.username, $options: 'i' } })
    if (dbmatch) {
        const validate = await bcrypt.compare(user.password, dbmatch.password);
        if (validate) {
            return callback(dbmatch);
        } else {
            return callback(undefined, 'Username or password is incorrect', 404);
        }
    } else {
        return callback(undefined, 'Username does not exist', 404);
    }
}

module.exports = authenticate;