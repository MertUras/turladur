export class DeleteTourCommand {
  constructor(
    public readonly tourId: string,
    public readonly partnerId: string | undefined,
    public readonly role: string,
  ) {}
}
