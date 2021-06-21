import Dom from "../Dom.js";

import domtoimage from "https://cdn.skypack.dev/dom-to-image";
import EventEmitter from "../../EventEmitter.js";

/**
 * Taskbar dom interface
 */
export default class DraggableWindow extends Dom {

     header = new Dom("div", { className: "header" });
     content = new Dom("div", { className: "content" });

     title = new Dom("div", { className: "title" });
     headerActions = new Dom("div", { className: "headerActions" })

     id = Number(String(Math.random()).split(".").pop());

     emitter = new EventEmitter();

     /** @type {Array<Dom>} */
     screenshots = []

     /**
      * Constructs the dom
      */
     constructor(config) {
          super("div", { id: "DraggableWindow" });

          this.title.text = config.title

          this.add(
               this.header,
               this.content
          );

          this.header.add(
               this.title,
               this.headerActions
          )

          this.style = {
               height: config.height + "px",
               width: config.width + "px"
          };

          this.headerAction({
               icon: "close",
               then: () => this.close()
          });

     }

     /**
      * 
      * @param {object} config 
      * @param {string} config.icon
      * @param {function} config.then
      */
     headerAction(config) {

          const body = new Dom("div", {
               className: "headerIcon",
               append: [new Dom("span", { className: "material-icons", innerText: config.icon })]
          });

          body.event("click", e => {
               e.stopPropagation();
               config.then();
          })

          this.headerActions.add(body)
     }

     /**
      * Screenshots the header content div to png.
      * 
      * @return {Dom}
      */
     async screenshot() {
          const screenshot = new Dom("img", {
               className: "screenshot",
               src: await domtoimage.toPng(this.content.element, {
                    quality: 0.5
               })
          });

          this.screenshots.push(screenshot);

          return screenshot;
     }

     dragElement() {
          const scope = this;

          let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

          this.header.element.onmousedown = dragMouseDown;

          function dragMouseDown(e) {
               e = e || window.event;
               e.preventDefault();
               // get the mouse cursor position at startup:
               pos3 = e.clientX;
               pos4 = e.clientY;
               document.onmouseup = closeDragElement;
               // call a function whenever the cursor moves:
               document.onmousemove = elementDrag;
          }

          function elementDrag(e) {
               e = e || window.event;
               e.preventDefault();
               // calculate the new cursor position:
               pos1 = pos3 - e.clientX;
               pos2 = pos4 - e.clientY;
               pos3 = e.clientX;
               pos4 = e.clientY;
               // set the element's new position:
               scope.element.style.top = (scope.element.offsetTop - pos2) + "px";
               scope.element.style.left = (scope.element.offsetLeft - pos1) + "px";
          }

          function closeDragElement() {
               /* stop moving when mouse button is released:*/
               document.onmouseup = null;
               document.onmousemove = null;
          }
     }

     close() {

          this.delete();

          this.screenshots.forEach(element => element.remove());

          this.header.element.onmousedown = null;

          this.emitter.emit("close-window", this)
     }

     init(root) {
          this.dragElement();

          root.viewport.add(this);

          this.content.style = {
               height: `${this.element.offsetHeight - this.header.element.offsetHeight}px`
          }
     }

}