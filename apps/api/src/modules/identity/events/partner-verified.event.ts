export class PartnerVerifiedEvent {
  constructor(
    public readonly partnerId: string,
    public readonly contactEmail: string,
  ) {}
}
