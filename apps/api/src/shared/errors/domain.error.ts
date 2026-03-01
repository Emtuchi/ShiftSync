import { AppError } from './base.error';

export class ConstraintViolationError extends AppError {
  constructor(message: string) {
    super(message, 422);
  }
}