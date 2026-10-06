export class ApiError extends Error {
    constructor(msg,statusCode){
        super(msg)
        this.statusCode = statusCode || 500
        this.status = `${statusCode}`.startsWith(4) ? "Fail":"Error";
    }
}