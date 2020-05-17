/**
 * @extends Error
 */
import * as httpStatus from 'http-status'

export class ExtendableError extends Error {
  public name: string;
  public statusCode: number;

  constructor (message: string, statusCode: number) {
    super(message)
    this.name = this.constructor.name
    this.message = message
    this.statusCode = statusCode

    Error.captureStackTrace(this, this.constructor)
  }
}

export default class BackError extends ExtendableError {
  constructor (message: string, statusCode = httpStatus.INTERNAL_SERVER_ERROR) {
    super(message, statusCode)
  }

  toJSON () {
    return {
      message: this.message,
      statusCode: this.statusCode,
      ...(this.statusCode < 500) ? { name: this.name } : {}
    }
  }
}
