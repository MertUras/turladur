export class TourSearchPerformedEvent {
  constructor(
    public readonly query: string,
    public readonly category: string | undefined,
    public readonly resultCount: number,
    public readonly cacheHit: boolean,
  ) {}
}
