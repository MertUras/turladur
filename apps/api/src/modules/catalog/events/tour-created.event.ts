export class TourCreatedEvent {
  constructor(
    public readonly tourId: string,
    public readonly partnerId: string,
  ) {}
}
