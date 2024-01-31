import express = require('express');
import { connectDB } from './configdb/db';
import MongoStore from 'connect-mongo';
import {main_router} from './router/main.router';
import passport from 'passport';
import session from 'express-session';
import {PassportStrategy} from './strategy/passport.local.strategy';
const cors = require('cors')
import * as dotenv from "dotenv";
dotenv.config()

const port = process.env.NODE_LOCAL_PORT || 3000;
const app= express();

PassportStrategy(passport)


connectDB();

app.use(cors())
app.use(express.urlencoded({extended: true}));
app.use(express.json());

const token = process.env.SECRET_TOKEN;

if (!token) {
  throw new Error('SECRET_TOKEN is not defined in the environment variables');
}

app.use(session({
    secret: token,
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: false,
      maxAge: 1* 60* 60 * 1000//1 hours
     },
    store: MongoStore.create({mongoUrl: process.env.MONGO_URI}),
  }));

app.use(passport.initialize());
app.use(passport.authenticate('session'));

app.use(main_router)




app.listen(port, () => {
    console.log(`Now running on port ${port}, please use me>>>`);
   
});
