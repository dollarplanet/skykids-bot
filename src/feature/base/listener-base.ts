export abstract class ListenerBase {
  protected abstract registerListener(): void;

  constructor() {
    this.registerListener();
  }
}