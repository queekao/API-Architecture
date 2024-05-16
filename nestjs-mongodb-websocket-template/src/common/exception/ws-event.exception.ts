export class WsEventException<T extends Error = Error> {
  eventName!: string;
  error: T;

  constructor(eventName: string, error: T) {
    this.eventName = eventName;
    this.error = error;
  }
}
