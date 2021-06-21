export default class EventEmitter {

  /** @type {Map<string, Array<function>>} */
  #events = new Map();

  /**
   * 
   * @param {string} name emitter name
   * @param {function} listener emitter callback
   */
  addEventListener(name, listener) {
    if (!this.#events.has(name)) this.#events.set(name, [])

    const event = this.#events.get(name);

    event.push(listener);
  }

  /**
   * 
   * @param {string} name emitter name
   * @param {function} listenerToRemove emitter callback function to be removed
   * @returns {void}
   */
  removeListener(name, listenerToRemove) {
    if (!this.#events.has(name)) return;

    const event = this.#events.get(name);

    this.#events.set(name, event.filter(listener => listener !== listenerToRemove))
  }

  /**
   * 
   * @param {string} name emitter name
   * @param {any} data data to be parsed the callbacks
   * @returns 
   */
  emit(name, data?: any) {
    if (!this.#events.has(name)) return;

    const event = this.#events.get(name);

    event.forEach(callback => callback(data));
  }
}