export class UpdateCafeCommand {
  constructor(
    public readonly id: string,
    public readonly name?: string,
    public readonly description?: string,
    public readonly location?: string,
    public readonly logo?: string | null,
  ) {}
}
