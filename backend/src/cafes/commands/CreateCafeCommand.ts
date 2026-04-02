export class CreateCafeCommand {
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly location: string,
    public readonly logo?: string,
  ) {}
}
