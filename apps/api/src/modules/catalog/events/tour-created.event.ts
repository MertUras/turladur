export class TourCreatedEvent {
  constructor(
    public readonly tourId: string,
    public readonly agencyId: string,
  ) {}
}
