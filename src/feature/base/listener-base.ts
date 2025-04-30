export class ListenerBase {
  protected registerListener(): void {};

  constructor() {
    this.registerListener();
  }
}