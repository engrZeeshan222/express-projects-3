//file for all routes
import {brandsRoute}  from './brandsRoute'
import { response as res } from 'express'
import express from 'express'
const router = express.Router()


// middleware that is specific to this router
router.use((req, res, next) => {
    console.log('Time-AllRoutes: ', Date.now())
    next()
  })

router.use('/brands', brandsRoute);

export {router as mainRoute};


// api/v1/brands/getAllBrands