export class PartnerRegisteredEvent {
  constructor(
    public readonly partnerId: string,
    public readonly userId: string,
    public readonly contactEmail: string,
    public readonly verificationToken: string,
  ) {}
}
