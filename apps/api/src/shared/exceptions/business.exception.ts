export class BusinessException extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number = 422,
  ) {
    super(message);
    this.name = 'BusinessException';
  }
}
