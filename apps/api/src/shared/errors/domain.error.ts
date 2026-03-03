import { AppError } from './base.error.js';

export class ConstraintViolationError extends AppError {
  constructor(message: string) {
    super(message, 422);
  }
}