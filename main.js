import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import { errorHandle } from './middleware/errorMiddleWare.js'
import { mongConnection } from "./config/config.js"
import userRouter from "./routes/userRouter.js"
import postRouter from "./routes/postRouter.js"
import authRouter from "./routes/authRouter.js"
import groupRouter from "./routes/groupRouter.js"
import { ApiError } from './utils/apiError.js'
import { logIn } from './controllers/authUser.js'

dotenv.config()

const PORT = process.env.PORT || 4002
const app = express()

app.use(cors())
mongConnection()
app.use(morgan('dev'))
app.use(express.json())

app.use('/api/user', userRouter)
app.use('/api/post', postRouter)
app.use('/api/auth', authRouter)
app.use('/api/group', groupRouter)

app.all('/{*path}', (req, res, next) => {
    // const error = new Error("Route wasn't found, try again!")
    // console.log(error)
    // next(error.message)
    next(new ApiError("Route wasn't found, try again!"))
})

//Error handling middleware
app.use(errorHandle)

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})

//Handle unhandled promise rejections outside of express
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err)
    server.close(() => process.exit(1))
})

export default app
