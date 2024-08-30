import dotenv from "dotenv"
import connectDB from "./db/index.js";
import express from 'express'

dotenv.config({
    path: './env'
})

const app = express();
connectDB()
    .then(() => {
        app.on('error', (error) => {
            console.log(error)
        })
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Express app is running on port : ${process.env.PORT}`)
        })
    })
    .catch((error) => {
        console.log(error)
    })




/*
const app = express()
    (async () => {
        try {
            await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
            app.on('error', (error) => {
                console.log('ERROR', error)
            })
            app.listen(process.env.PORT, () => {
                console.log(`App is listing on port ${process.env.PORT}`)
            })
        } catch (error) {
            console.log('ERROR :', error)
        }
    })()
*/