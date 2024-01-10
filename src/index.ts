import express = require('express');
import * as dotenv from "dotenv";
import { connectDB } from './configdb/db';
import {main_router} from './router/main.router';

dotenv.config()
const app= express();

connectDB();

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(main_router)

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Now running on port ${port}, please use me>>>`);
});
