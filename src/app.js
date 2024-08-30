import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()

app.use(cors({
    origin: env.process.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: '16kb' })) // use when you want to limit data in JSON
app.use(express.urlencoded({ extended: true, limit: '16kb' })) // use when data come from URL
app.use(express.static("public")) // use whem you want to store data on your server
app.use(cookieParser())

export { app }