export class ReviewDeletedEvent {
  constructor(
    public readonly reviewId: string,
    public readonly tourId: string,
    public readonly partnerId: string,
  ) {}
}
