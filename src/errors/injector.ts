export class NotFoundError extends Error {
  constructor(message = "Inject value not found") {
    super(message);
  }
}
