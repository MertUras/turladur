export class ReviewDeletedEvent {
  constructor(
    public readonly reviewId: string,
    public readonly tourId: string | null,
    public readonly agencyId: string,
    public readonly experienceId: string | null = null,
  ) {}
}
