import {ErrorRequestHandler} from 'express'

const errorHandler: ErrorRequestHandler = (error, req, res, next) => res.status(500).json({message: 'Internal Server Error'})

export default errorHandler