import express from 'express'
const router = express.Router()
import {response as res} from 'express'


// middleware that is specific to this router
router.use((req, res, next) => {
    console.log('Time-BrandRoutes: ', Date.now())
    next()
  })

//Get all Method
router.get('/getAllBrands', (req, res) => {
    res.send('getAllBrands  API')
})

export {router as brandsRoute};