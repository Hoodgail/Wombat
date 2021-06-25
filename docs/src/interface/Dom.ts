/**
 * A class for manipulating dom elements easier.
 * 
 * @author hoodgail benjamin
 */


export declare var DomElement: Element | EventTarget | Node | HTMLElement | Document | ParentNode | NodeListOf<Element> | null

export default class Dom {
     public element: typeof DomElement;
     public cloneId?: number;

     /**
     * Creating a dom constructor from an html element
     * Represents a DOM element.
     * 
     * @constructor
     *  
     * @param {string|Element} query - The object element tag name or and element
     * @param {Object} config - The config to be assigned
     */
     constructor(query: string | typeof DomElement = "div", config?: any) {

          this.element = typeof query == "string"
               ? document.createElement(query)
               : query;

          this.setProperties(config || {})
     }

     attribute(property: string, value: string): void {
          if (this.element instanceof Element)
               this.element.setAttribute(property, value)
     }

     /**
     * Assign properties to the element
     *  
     * @param {Object} config - The object with properties to be assgined
     */
     setProperties(config: any): void {
          Object.keys(config)
               .forEach(name => this.property(name, config[name]));
     }

     /**
     * The property to be assigned to the element
     *  
     * @param {string}   name - Property's name
     * @param {*} value - Property's value from name
    */
     property(name: string, value: any): void {
          switch (name) {
               case "append":
               case "add": this.add(...value)
                    break;
               case "eval": value.apply(this)
                    break;
               case "style": this.style = value;
                    break;
               default: Object.assign(this.element, { [name]: value })
          }
     }

     /**
      * @param {Boolean} deep - the element and its whole subtree—including text that may be in child Text nodes—is also copied.
      * @param {object} config - element config to be assigned
      * 
      * @return {Dom}
     */
     clone(deep: boolean = false, config: any = {}): Dom | undefined {
          if (this.element instanceof Element) return new Dom(this.element.cloneNode(deep), config);
          else return;
     }

     /**
      * Hides the element
      * sets the style display to none
     */
     hide(): void { this.display = "none"; }

     /**
      * Shows the element
      * sets the style display to block
     */
     show(): void { this.display = "block"; }

     /**
      * Inserts nodes after the last child of node, while replacing strings in nodes with equivalent Text nodes.
      
      * Throws a "HierarchyRequestError" DOMException if the constraints of the node tree are violated.
      * 
      * @param {Array<Dom>} doms - Adding more Doms to the main dom as children
      * 
      * @return {Dom}
     */
     add(...doms: Array<Dom>): Dom {
          if (this.element instanceof Element)
               this.element.append(...doms
                    .map(r => {
                         if (r.element instanceof Node) {
                              return r.element
                         } else {
                              throw new Error("Element should be a Node instance")
                         }
                    }));

          return this;

     }

     /**
      * Inserts nodes before the first child of node, while replacing strings in nodes with equivalent Text nodes.
     
      * Throws a "HierarchyRequestError" DOMException if the constraints of the node tree are violated.
      * 
      * @param {Array<Dom>} doms - Adding more Doms to the main dom as children
      * 
      * @return {Dom}
     */
     pre(...doms: Array<Dom>): Dom {
          if (this.element instanceof Element)
               this.element.prepend(...doms
                    .map(r => {
                         if (r.element instanceof Node) {
                              return r.element
                         } else {
                              throw new Error("Element should be a Node instance")
                         }
                    }))
          return this
     }

     /**
      * Returns the dom html as string
      * if there's no parent it will return its innerHTML
      * 
      * @return {String} 
     */
     toString(): string | null {
          if (this.element instanceof Element) return this.element.outerHTML
          else return null
     }

     /**
      * Trims the html text's string
     */
     trim(): void { this.html = this.text.trim() }

     /**
      * Clears the dom element
     */
     clear(): void {
          if (this.element instanceof Element)
               this.element.innerHTML = ""
     }

     /**
      * Getting a dom children
      * 
      * @param {string}   query - search query selector string
      * @param {object} config - element config to be assigned
      * @param {Boolean} deep - If multiple elements is to be selected
      * 
      * @return {Dom|Array<Dom>}
     */
     get(query: string = "div", config: any = {}, deep = false): Dom | Array<Dom> | undefined {

          if (this.element instanceof Element) {
               if (deep) {
                    const elements = this.element.querySelectorAll(query);

                    return [...elements].map(element => new Dom(element, config));
               } else {

                    const element = this.element.querySelector(query);

                    return new Dom(element, config);
               }
          }
     }

     /**
      * Adding an event listener
      * @param {string} name - event name
      * @param {EventListenerOrEventListenerObject} callback - event callback function to be called on dispatch
     */
     event(name: string, callback: EventListenerOrEventListenerObject) {
          if (this.element instanceof Element)
               this.element.addEventListener(name, callback)
     }

     /**
      * Removes the element from its parent
      * if possible
     */
     delete() { this.remove() }

     /**
      * Removes the element from its parent
      * if it has a parent
     */
     remove() {
          if (this.element instanceof Element)
               this.element.remove()
     }

     /**
      * Getting a dom children
      * @param query - search query selector string
      * @param config - element config to be assigned
      * @param deep - If multiple elements is to be selected
      * @param body - parent of element to be selected from
      * 
      * @return {Dom|Array<Dom>}
     */
     static Get(query: string = "div", config: any = {}, deep = false, body: typeof DomElement = document): Dom | Array<Dom> | undefined {
          if (body instanceof Element) {
               if (deep) {
                    const elements = body.querySelectorAll(query);

                    return [...elements].map((element: Element) => new Dom(element, config));
               } else {

                    const element = body.querySelector(query);

                    return new Dom(element, config);
               }
          }


     }

     get rect(): DOMRect {
          if (this.element instanceof Element)
               return this.element.getBoundingClientRect()
          else return new DOMRect()
     }

     /**
      * Setting value to element
      * if input or select
      * 
     */
     set value(value: string | number) {
          if (this.element instanceof HTMLInputElement
               || this.element instanceof HTMLButtonElement
               || this.element instanceof HTMLMeterElement
               || this.element instanceof HTMLLIElement
               || this.element instanceof HTMLOptionElement
               || this.element instanceof HTMLProgressElement
               || this.element instanceof HTMLParamElement
               || this.element instanceof HTMLTextAreaElement)
               this.element.value = value
     }

     /**
      * Getting value from element
      * if input or select
     */
     get value(): string | number {
          if (this.element instanceof HTMLInputElement
               || this.element instanceof HTMLButtonElement
               || this.element instanceof HTMLMeterElement
               || this.element instanceof HTMLLIElement
               || this.element instanceof HTMLOptionElement
               || this.element instanceof HTMLProgressElement
               || this.element instanceof HTMLParamElement
               || this.element instanceof HTMLTextAreaElement)
               return this.element.value
          else return ""
     }

     /**
      * Setting the source url to element
     */
     set src(src: string) {
          if (this.element instanceof HTMLAudioElement
               || this.element instanceof HTMLEmbedElement
               || this.element instanceof HTMLIFrameElement
               || this.element instanceof HTMLImageElement
               || this.element instanceof HTMLInputElement
               || this.element instanceof HTMLScriptElement
               || this.element instanceof HTMLSourceElement
               || this.element instanceof HTMLTrackElement
               || this.element instanceof HTMLVideoElement)
               this.element.src = src
     }

     /**
      * Setting the source url to element
     */
     get src(): string {
          if (this.element instanceof HTMLAudioElement
               || this.element instanceof HTMLEmbedElement
               || this.element instanceof HTMLIFrameElement
               || this.element instanceof HTMLImageElement
               || this.element instanceof HTMLInputElement
               || this.element instanceof HTMLScriptElement
               || this.element instanceof HTMLSourceElement
               || this.element instanceof HTMLTrackElement
               || this.element instanceof HTMLVideoElement)
               return this.element.src;

          return ""
     }

     /**
      * Changing the dom's style display
     */
     set display(display: string) {
          if (!display) display = "block";
          this.style = { display }
     }

     /**
      * Changing the dom's style background
     */
     set background(background: string) {
          this.style = { background }
     }

     /**
      * Adding a click event to the dom
      * 
      * @param {Function} fn - function to be called on click
     */
     set click(fn: EventListenerOrEventListenerObject) {
          if (this.element instanceof Element)
               this.element.addEventListener("click", fn)
     }

     /**
      * Getting the dom element's text
     */
     get text(): string {
          if (this.element instanceof HTMLElement)
               return this.element.innerText
          else return ""
     }

     /**
      * Seting the text of the dom
      * Adding a dom to the element
      * 
      * @param {Dom|String} data - Text to be set or dom to be added
     */
     set text(data: Dom | string) {
          if (data instanceof Dom) this.add(data)
          else if (typeof data == "string" && this.element instanceof HTMLElement) {
               this.element.innerText = data
          }
     }

     /**
      * Getting dom html
     */
     get html(): string {
          if (this.element instanceof HTMLElement)
               return this.element.innerHTML
          else return ""
     }

     /**
      * Seting the html of the dom
      * Adding a dom to the element
      * 
      * @param {Dom|String} data - Text to be set or dom to be added
     */
     set html(data: Dom | string) {
          if (data instanceof Dom) this.add(data)
          else if (typeof data == "string" && this.element instanceof HTMLElement) {
               this.element.innerHTML = data
          }
     }

     /**
      * Returns the element's style as object
      * does not return styles set by css
     */
     get style(): any {
          if (this.element instanceof Element)
               return getComputedStyle(this.element)
          else null
     }

     /**
      * Setting style to the dom as object or string
      * 
      * @param {any} style - The style data
      * 
      * @example 
      * const dom = new Dom("div", {});
      * dom.style = { background: "black" };
      * dom.style = "background: black";
     */
     set style(style: any) {
          if (style !== null && style !== undefined && this.element instanceof HTMLElement) {
               if (typeof style == "string") {
                    this.element.setAttribute("style", style)
                    return;
               }

               Object.keys(style).forEach((name: any) => {
                    if (this.element instanceof HTMLElement) {
                         Object.assign(this.element.style, {
                              [name]: style[name]
                         })
                    }
               });
          }

     }
}