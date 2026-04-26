export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number = 500,
    public readonly retriable: boolean = false
  ) {
    super(message)
    this.name = this.constructor.name
  }
}

export class AuthError extends AppError {
  constructor(msg = 'Unauthorized') {
    super('AUTH_ERROR', msg, 401, false)
  }
}

export class ForbiddenError extends AppError {
  constructor(msg = 'Access denied') {
    super('FORBIDDEN', msg, 403, false)
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super('NOT_FOUND', `${resource} not found`, 404, false)
  }
}

export class ValidationError extends AppError {
  constructor(msg: string) {
    super('VALIDATION_ERROR', msg, 400, false)
  }
}

export class ConflictError extends AppError {
  constructor(msg: string) {
    super('CONFLICT', msg, 409, false)
  }
}

export class DatabaseError extends AppError {
  constructor(msg: string) {
    super('DATABASE_ERROR', msg, 500, true)
  }
}

export type ActionError = { error: string; code: string; retriable: boolean }

export function toActionError(err: unknown): ActionError {
  if (err instanceof AppError) {
    return { error: err.message, code: err.code, retriable: err.retriable }
  }
  console.error('[Unexpected]', err)
  return { error: 'Something went wrong', code: 'INTERNAL_ERROR', retriable: true }
}
