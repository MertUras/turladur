export class PartnerVerifiedEvent {
  constructor(
    public readonly agencyId: string,
    public readonly contactEmail: string,
    public readonly companyName: string,
  ) {}
}
