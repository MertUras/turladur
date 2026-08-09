export class ReviewCreatedEvent {
  constructor(
    public readonly reviewId: string,
    public readonly tourId: string | null,
    public readonly agencyId: string,
    public readonly userId: string,
    public readonly rating: number,
    public readonly experienceId: string | null = null,
  ) {}
}
