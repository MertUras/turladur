export class ReviewCreatedEvent {
  constructor(
    public readonly reviewId: string,
    public readonly tourId: string,
    public readonly partnerId: string,
    public readonly userId: string,
    public readonly rating: number,
  ) {}
}
