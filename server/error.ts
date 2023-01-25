import { H3Error, H3Event } from 'h3'
import mongoose from 'mongoose'
import { Exception } from './models/Exception'

interface GenericError extends Error {
  statusMessage?: string
  statusCode: number
  data: string
}

export const errorResponse = (err: Error | unknown, event: H3Event) => {
  console.log(err)
  let error: GenericError = {
    statusMessage: 'Unknown Error',
    statusCode: 400,
    data: 'An unknown error occurred processing your request. Please try again later.',
    name: '',
    message: '',
  }

  if (err instanceof mongoose.Error.ValidationError) {
    error.statusMessage = err.name
    error.statusCode = 422
    const key = Object.keys(err.errors)[0]
    error.data = err.errors[key].message
  } else if (err instanceof Exception || err instanceof H3Error) {
    error = { statusCode: err.statusCode, data: err.data, name: '', message: '' }
  } else if (err instanceof Error) {
    error = {
      statusCode: 400,
      data: err.message,
      name: '',
      message: '',
    }
  }
  return sendError(event, error)
}
