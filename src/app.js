import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: '16kb' })) // use when you want to limit data in JSON
app.use(express.urlencoded({ extended: true, limit: '16kb' })) // use when data come from URL
app.use(express.static("public")) // use whem you want to store data on your server
app.use(cookieParser())


// route import
import userRouter from './routes/user.route.js'

// route declaradtion
app.use("/api/v1/users", userRouter)


// http://localhost:8000/api/v1/users/register

export { app }