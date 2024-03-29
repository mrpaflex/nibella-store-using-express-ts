import express from 'express';
import { connectDB } from './configdb/db';
import MongoStore from 'connect-mongo';
import {main_router} from './router/main.router';
import passport from 'passport';
import session from 'express-session';
import {PassportStrategy} from './strategy/passport.local.strategy';

import cors from 'cors';
import * as dotenv from "dotenv";
dotenv.config()

const app= express();

app.use(cors())


PassportStrategy(passport)
connectDB();

//app.use(express.urlencoded({extended: true}));
app.use(express.json());

const token = process.env.SECRET_TOKEN;

if (!token) {
  throw new Error('SECRET_TOKEN is not defined in the environment variables');
}


app.use(session({
    secret: token,
    resave: false,
    saveUninitialized: true,
    cookie: {
      //secure: true,
      maxAge: 1*60*60*60,
      sameSite: 'none'
    },
    //will be removed on production
    store: MongoStore.create({mongoUrl: process.env.MONGO_URI}),
  }));

app.use(passport.initialize());
//app.use(passport.session());
app.use(passport.authenticate('session'));

app.use(main_router)



const port = process.env.NODE_LOCAL_PORT || 3000;
app.listen(port, () => {
    console.log(`Now running on port ${port}, please use me>>>`);
   
});
