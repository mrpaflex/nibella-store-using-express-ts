import express = require('express');
import * as dotenv from "dotenv";
import { connectDB } from './configdb/db';
import {main_router} from './router/main.router';
import passport from 'passport';
import session from 'express-session';
import {PassportStrategy} from './strategy/passport.local.strategy';

dotenv.config()

const app= express();

connectDB();
PassportStrategy(passport)

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(main_router)

//const token = process.env.TOKEN_SECRET;

app.use(session({
    secret: 'token',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  }));

app.use(passport.initialize());
app.use(passport.authenticate('session'));

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Now running on port ${port}, please use me>>>`);
});
