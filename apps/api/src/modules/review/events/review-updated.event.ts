export class ReviewUpdatedEvent {
  constructor(
    public readonly reviewId: string,
    public readonly tourId: string | null,
    public readonly partnerId: string,
    public readonly experienceId: string | null = null,
  ) {}
}
