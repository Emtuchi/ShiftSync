import { AppError } from './base.error.js';

export class ValidationError extends AppError {
  constructor(message = 'Invalid input') {
    super(message, 400);
  }
}