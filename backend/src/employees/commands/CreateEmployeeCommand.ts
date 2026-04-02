export class CreateEmployeeCommand {
  constructor(
    public readonly name: string,
    public readonly emailAddress: string,
    public readonly phoneNumber: string,
    public readonly gender: 'Male' | 'Female',
    public readonly cafeId?: string,
  ) {}
}
