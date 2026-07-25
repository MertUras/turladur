export class TourCancelledEvent {
  constructor(
    public readonly tourId: string,
    public readonly partnerId: string,
    public readonly tourTitle: string,
    public readonly reasonCode: string,
    public readonly reasonLabel: string,
  ) {}
}
