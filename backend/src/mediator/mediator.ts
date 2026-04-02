import { injectable } from 'tsyringe';

export interface IRequestHandler<TRequest, TResponse> {
  handle(request: TRequest): Promise<TResponse>;
}

@injectable()
export class Mediator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private handlers = new Map<string, IRequestHandler<any, any>>();

  register<TRequest, TResponse>(
    commandClass: new (...args: never[]) => TRequest,
    handler: IRequestHandler<TRequest, TResponse>,
  ): void {
    this.handlers.set(commandClass.name, handler);
  }

  async send<TResponse>(command: object): Promise<TResponse> {
    const name = command.constructor.name;
    const handler = this.handlers.get(name);
    if (!handler) {
      throw new Error(`No handler registered for: ${name}`);
    }
    return handler.handle(command) as Promise<TResponse>;
  }
}
