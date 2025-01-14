import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/utils";

export class CustomError extends Error {
    statusCode: number;
    errors?: any;
  
    constructor(message: string, statusCode: number, errors?: any) {
      super(message);
      this.statusCode = statusCode;
      this.errors = errors;
    }
  }

export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction): void => {
const statusCode = err.statusCode || 500;
const response = {
    message: err.message || 'Internal Server Error',
    errors: err || []
};
sendResponse(req, res, response, statusCode)
};