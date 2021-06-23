export default class EventEmitter {

  /** @type {Map<string, Array<Function>>} */
  #events: Map<string, Array<Function>> = new Map();

  /**
   * 
   * @param {string} name emitter name
   * @param {function} listener emitter callback
   */
  addEventListener(name: string, listener: Function) {
    if (!this.#events.has(name)) this.#events.set(name, [])

    const event = this.#events.get(name) || [];

    event.push(listener);
  }

  /**
   * 
   * @param {string} name emitter name
   * @param {function} listenerToRemove emitter callback function to be removed
   * @returns {void}
   */
  removeListener(name: string, listenerToRemove: Function) {
    if (!this.#events.has(name)) return;

    const event = this.#events.get(name) || [];

    this.#events.set(name, event.filter((listener: Function) => listener !== listenerToRemove))
  }

  /**
   * 
   * @param {string} name emitter name
   * @param {any} data data to be parsed the callbacks
   * @returns 
   */
  emit(name: string, data?: any) {
    if (!this.#events.has(name)) return;

    const event = this.#events.get(name) || [];

    event.forEach((callback: Function) => callback(data));
  }
}