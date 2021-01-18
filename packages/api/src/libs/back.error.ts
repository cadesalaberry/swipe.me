/**
 * @extends Error
 */
import * as httpStatus from 'http-status'

export default class BackError extends Error {
  public name: string;
  public details: string;
  public statusCode: number;

  constructor (message: string, statusCode: number = httpStatus.INTERNAL_SERVER_ERROR) {
    super(message)
    this.name = this.constructor.name
    this.details = message
    this.statusCode = statusCode

    Error.captureStackTrace(this, this.constructor)
  }
}
