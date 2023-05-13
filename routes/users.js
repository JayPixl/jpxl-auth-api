const router = require('express').Router();
const authenticate = require('../middleware/authenticate');
const mongoose = require('mongoose');
const User = require('../middleware/dbconnect');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const cookieParser = require('cookie-parser');

router.use(cookieParser());

require('dotenv').config('../.env');
const saltRounds = Number(process.env.SALT_ROUNDS);

router.get('/', async (req, res) => {
    res.status(200).json(await User.find());
})

router.post('/login', async (req, res) => {
    authenticate(req.body, (dbmatch, err, errcode) => {
        if (err) {
            res.status(errcode).json({err});
        } else {
            const accessToken = jwt.sign({username: dbmatch.username}, process.env.ACCESS_TOKEN_SECRET);
            res.json({ accessToken });
        }
    })
})

router.post('/new', async (req, res) => {
    const match = await User.find({ username: { $regex: req.body.username, $options: 'i' } })
    if (match[0]) {
        res.status(404).json({err: 'User already exists'});
    } else {
        bcrypt.hash(req.body.password, saltRounds, (error, hash) => {
            if (error) res.status(500).json({err: 'Could not create new user'});
            const newUser = new User({
                username: req.body.username,
                password: hash
            })
            newUser.save();

            const accessToken = jwt.sign({username: newUser.username}, process.env.ACCESS_TOKEN_SECRET);
            res.status(201).json({ accessToken });
        })
        
    }
})

router.post('/auth', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.status(401).json({err: 'No access token found'});

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) return res.status(403).json({err: 'Access Token is invalid'});

        const [ match ] = await User.find({ username: { $regex: user.username, $options: 'i' } });
        res.json(match);
    })
})

router.delete('/delete', async (req, res) => {
    authenticate(req.body, async (dbmatch, err, errcode) => {
        if (err) {
            res.status(errcode).json({err});
        } else {
            const result = await User.findByIdAndDelete(dbmatch._id);

            res.json(result);
        }
    })
})

module.exports = router;