import { Response } from "express";
import mongoose from "mongoose";
import { CUSTOM_VALIDATION } from "../models/user";

interface HandleClientErrorResponse {
  code: number;
  error: string;
}

export abstract class BaseController {
  protected sendCreateUpdateErrorResponse(res: Response, error: mongoose.Error.ValidationError | Error): void {
    if (error instanceof mongoose.Error.ValidationError) {
      const clientErrors = this.handleClientError(error)
      res.status(clientErrors.code)
        .send({ code: clientErrors.code, error: clientErrors.error });
    } else {
     res.status(500).send({ code: 500, error: 'Something went wrong!' })
    }
  }

  private handleClientError(error: mongoose.Error.ValidationError): HandleClientErrorResponse {
    const duplicatedErrors = Object.values(error.errors).filter((err) => err.kind === CUSTOM_VALIDATION.DUPLICATED)
    if (duplicatedErrors.length) {
      return { code: 409, error: error.message }
    }
    return { code: 422, error: error.message }
  }
}
