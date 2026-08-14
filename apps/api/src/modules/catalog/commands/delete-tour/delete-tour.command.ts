export class DeleteTourCommand {
  constructor(
    public readonly tourId: string,
    public readonly agencyId: string | undefined,
    public readonly role: string,
    public readonly deletedBy?: string,
  ) {}
}
