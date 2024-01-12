import express = require('express');
import { connectDB } from './configdb/db';
import MongoStore from 'connect-mongo';
import {main_router} from './router/main.router';
import passport from 'passport';
import session from 'express-session';
import {PassportStrategy} from './strategy/passport.local.strategy';
import * as dotenv from "dotenv";
dotenv.config()

const port = process.env.PORT || 3000;
const app= express();
connectDB();
PassportStrategy(passport)

app.use(express.urlencoded({extended: true}));
app.use(express.json());

console.log(process.env.TOKEN_SECRET)

app.use(session({
    secret: "thisis not makeing sense for me i would have love to use .env",
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: false,
      maxAge: 1 * 60 * 60 * 1000
     },
    store: MongoStore.create({mongoUrl: process.env.MONGO_URI}),
  }));

app.use(passport.initialize());
app.use(passport.authenticate('session'));

app.use(main_router)



app.listen(port, () => {
    console.log(`Now running on port ${port}, please use me>>>`);
});
