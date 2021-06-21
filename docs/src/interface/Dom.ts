/**
 * A class for manipulating dom elements easier.
 * 
 * @author hoodgail benjamin
 */
export default class Dom {
     public element: any;
     public cloneId: number;

     /**
     * Creating a dom constructor from an html element
     * Represents a DOM element.
     * 
     * @constructor
     *  
     * @param {string|Element} query - The object element tag name or and element
     * @param {Object} config - The config to be assigned
     */
     constructor(query: string | HTMLElement | Element = "div", config?: any) {

          this.element = typeof query == "string"
               ? document.createElement(query)
               : query;

          this.setProperties(config || {})
     }

     attribute(property: string, value: string): void { this.element.setAttribute(property, value) }

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
               default: this.element[name] = value
          }
     }

     /**
      * @param {Boolean} deep - the element and its whole subtree—including text that may be in child Text nodes—is also copied.
      * @param {object} config - element config to be assigned
      * 
      * @return {Dom}
     */
     clone(deep: boolean = false, config: any = {}): Dom {
          return new Dom(this.element.cloneNode(deep), config);
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
          this.element.append(...doms.map(r => r.element))
          return this
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
          this.element.prepend(...doms.map(r => r.element))
          return this
     }

     /**
      * Returns the dom html as string
      * if there's no parent it will return its innerHTML
      * 
      * @return {String} 
     */
     toString(): string { return this.element.parent ? this.element.parent.innerHTML : this.element.outterHTML }

     /**
      * Trims the html text's string
     */
     trim(): void { this.html = this.text.trim() }

     /**
      * Clears the dom element
     */
     clear(): void { this.element.innerHTML = "" }

     /**
      * Getting a dom children
      * 
      * @param {string}   query - search query selector string
      * @param {object} config - element config to be assigned
      * @param {Boolean} deep - If multiple elements is to be selected
      * 
      * @return {Dom|Array<Dom>}
     */
     get(query: string | HTMLElement | Element = "div", config: any = {}, deep = false): Dom | Array<Dom> {
          if (deep) {
               const elements = this.element.querySelectorAll(query);

               return [...elements].map(element => new Dom(element, config));
          } else {

               const element = this.element.querySelector(query);

               return new Dom(element, config);
          }
     }

     /**
      * Adding an event listener
      * @param {string}   name - event name
      * @param {function} callback - event callback function to be called on dispatch
     */
     event(name, callback) { return this.element.addEventListener(name, callback) }

     /**
      * Removes the element from its parent
      * if possible
     */
     delete() { this.remove() }

     /**
      * Removes the element from its parent
      * if it has a parent
     */
     remove() { this.element.remove() }

     /**
      * Getting a dom children
      * @param query - search query selector string
      * @param config - element config to be assigned
      * @param deep - If multiple elements is to be selected
      * @param body - parent of element to be selected from
      * 
      * @return {Dom|Array<Dom>}
     */
     static Get(query: string = "div", config: any = {}, deep = false, body: HTMLElement | Element | Document = document): Dom | Array<Dom> {

          if (deep) {
               const elements = body.querySelectorAll(query);

               return [...elements].map((element: Element) => new Dom(element, config));
          } else {

               const element = body.querySelector(query);

               return new Dom(element, config);
          }


     }

     get rect() {
          return this.element.getBoundingClientRect()
     }

     /**
      * Setting value to element
      * if input or select
      * 
      * @param {string|Number} value - element value
     */
     set value(value) { this.element.value = value }

     /**
      * Getting value from element
      * if input or select
     */
     get value() { return this.element.value }

     /**
      * Setting the source url to element
      * 
      * @param {string}   src - The element's source
     */
     set src(src) { this.element.src = src }

     /**
      * Changing the dom's style display
      * 
      * @param {string}   display - The element's chosen display
     */
     set display(display) {
          if (!display) display = "block";
          this.style = { display }
     }

     /**
      * Changing the dom's style background
      * 
      * @param {string}   background - element's background style
     */
     set background(background) { this.style = { background } }

     /**
      * Adding a click event to the dom
      * 
      * @param {Function} fn - function to be called on click
     */
     set click(fn) { this.element.addEventListener("click", fn) }

     /**
      * Getting the dom element's text
     */
     get text() { return this.element.innerText }

     /**
      * Seting the text of the dom
      * Adding a dom to the element
      * 
      * @param {Dom|String|Number} data - Text to be set or dom to be added
     */
     set text(data) {
          if (data instanceof Dom) { this.add(data) }
          else if (typeof data == "string") { this.element.innerText = data }
          else if (typeof data == "number") { this.element.innerText = data.toString() }
     }

     /**
      * Getting dom html
     */
     get html() { return this.element.innerHTML }

     /**
      * Seting the html of the dom
      * Adding a dom to the element
      * 
      * @param {Dom|String} data - Text to be set or dom to be added
     */
     set html(data) {
          if (data instanceof Dom) { this.add(data) }
          else if (typeof data == "string") { this.element.innerHTML = data }
          else if (typeof data == "number") { this.element.innerHTML = data.toString() }
     }

     /**
      * Gets the element's position from the parent
      */
     get position() {
          let el = this.element;

          // yay readability
          for (var lx = 0, ly = 0;
               el != null;
               lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
          return { x: lx, y: ly };
     }

     /**
      * Returns the element's style as object
      * does not return styles set by css
     */
     get style() {
          return Object.fromEntries(Object.entries(this.element.style).filter(r => r[1]))
     }

     /**
      * Setting style to the dom as object or string
      * 
      * @param {Object|String} style - The style data
      * 
      * @example 
      * const dom = new Dom("div", {});
      * dom.style = { background: "black" };
      * dom.style = "background: black";
     */
     set style(style: any) {
          if (typeof style == "string") {
               this.element.style = style;
               return;
          }

          Object.keys(style).forEach(name => {
               this.element.style[name] = style[name];
          });
     }
}