import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'

import { errorHandle } from './middleware/errorMiddleWare.js'
import { mongConnection } from './config/config.js'

import userRouter from './routes/userRouter.js'
import postRouter from './routes/postRouter.js'
import authRouter from './routes/authRouter.js'
import groupRouter from './routes/groupRouter.js'

import { ApiError } from './utils/apiError.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

mongConnection()

app.use('/api/user', userRouter)
app.use('/api/post', postRouter)
app.use('/api/auth', authRouter)
app.use('/api/group', groupRouter)

app.all('/*path', (req, res, next) => {
    next(new ApiError("Route wasn't found, try again!"))
})

// Error handling middleware
app.use(errorHandle)

export default app
