import { ApiError } from '../utils/apiError.js'

export const errorHandle = (err, req, res, next) => {
    let statuscode = err.statusCode || 500

    if (process.env.NODE_ENV === "development") {
        return res.status(statuscode).json({
            status_code: statuscode,
            status: err.status,
            message: err.message,
            stack: err.stack
        })
    }
    else{
        if (err.name === 'JsonWebTokenError') 
            return new ApiError('Token was invalid, try again.',401)
        if (err.name === 'TokenExpiredError') 
            return new ApiError('Token has expired, please log in again.',401)
        res.status(statuscode).json({
            status_code: statuscode,
            status: err.status,
            message: err.message,
        })
    }
}

