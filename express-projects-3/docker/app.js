"use strict";

import express from 'express'
import dotenv from 'dotenv'
import  {mainRoute} from './src/routes'
import { Sequelize } from 'sequelize'

dotenv.config();
const app =  express();

//Top level async/await
(async () => {

//App Variable
const port = process.env.APP_DEV_PORT || 4000;
const host = process.env.BACKEND_HOST || `http://localhost`
const url = `${host}:${port}`
 

// Health test endpoint...
app.get("/", (req, res, next) => {
  return res.send("Welcome to Clothing-app. Everything working perfectly fine.");
});

//Routes
app.use('/api/v1', mainRoute)


  try {
    await app.listen(process.env.APP_DEV_PORT, () => {
      console.log(`Server started listening on url : ${url}`);
    });
  } catch (error) {
    console.log(`App Level Error : ${error}`);
  }
})();



