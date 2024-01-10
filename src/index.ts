import { Request, Response, Application } from 'express';
import express = require('express');
import * as dotenv from "dotenv";

dotenv.config()

const app: Application= express();

app.get('/', (req: Request, res: Response) => {
    res.send('This is just the beginning');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Now running on port ${port}, please use me>>>`);
});
