import Dom from "../Dom";

// @ts-ignore
import domtoimage from 'dom-to-image'; // u need to install this

import EventEmitter from "../../EventEmitter";
import Root from "../Root";

export interface DraggableWindowConfig {
     title: string,
     width: number
     height: number
};

export interface HeaderActionConfig {
     icon: string,
     then: Function
}

/**
 * Taskbar dom interface
 */
export default class DraggableWindow extends Dom {

     public config: DraggableWindowConfig;

     header = new Dom("div", { className: "header" });
     content = new Dom("div", { className: "content" });

     title = new Dom("div", { className: "title" });
     headerActions = new Dom("div", { className: "headerActions" })

     id = Number(String(Math.random()).split(".").pop());

     emitter = new EventEmitter();

     /** @type {Array<Dom>} */
     screenshots: Array<Dom> = []

     /**
      * Constructs the dom
      */
     constructor(config: DraggableWindowConfig) {
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

          this.config = config;

          this.style = {
               opacity: 0,
               transition: "height 0.1s linear, opacity 0.1s",
               height: "0px",
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
     headerAction(config: HeaderActionConfig) {

          const body = new Dom("div", {
               className: "headerIcon",
               append: [new Dom("span", { className: "material-icons", innerText: config.icon })]
          });

          body.event("click", (e: Event) => {
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
     async screenshot(): Promise<Dom> {
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

          if (this.header.element instanceof HTMLElement) this.header.element.onmousedown = dragMouseDown;

          function dragMouseDown(e: MouseEvent) {
               e = e || window.event;
               e.preventDefault();
               // get the mouse cursor position at startup:
               pos3 = e.clientX;
               pos4 = e.clientY;
               document.onmouseup = closeDragElement;
               // call a function whenever the cursor moves:
               document.onmousemove = elementDrag;
          }

          function elementDrag(e: MouseEvent) {
               e = e || window.event;
               e.preventDefault();
               // calculate the new cursor position:
               pos1 = pos3 - e.clientX;
               pos2 = pos4 - e.clientY;
               pos3 = e.clientX;
               pos4 = e.clientY;
               // set the element's new position:
               if (scope.element instanceof HTMLElement) {
                    scope.element.style.top = (scope.element.offsetTop - pos2) + "px";
                    scope.element.style.left = (scope.element.offsetLeft - pos1) + "px";
               }
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

          if (this.header.element instanceof HTMLElement) this.header.element.onmousedown = null;

          this.emitter.emit("close-window", this)
     }

     randomInt(min: number, max: number): number {
          return Math.floor(Math.random() * (max - min)) + min;
     }

     init(root: Root) {
          // make position sensitive to size and document's width

          if (root.viewport.element instanceof HTMLElement) {

               const parentRect = root.viewport.element.getBoundingClientRect();

               let left = Math.random() * (parentRect.width - this.config.width);
               let top = Math.random() * (parentRect.height - this.config.height)

               if (this.element instanceof HTMLElement) {
                    this.element.style.top = top + "px";
                    this.element.style.left = left + "px";
               }

               this.dragElement();

               root.viewport.add(this);

               this.content.style = {
                    opacity: 0,
                    transition: "opacity 0.2s"
               }

               setTimeout(() => {
                    this.style = {
                         opacity: 1,
                         height: this.config.height + "px",
                    };

                    setTimeout(() => {
                         if (this.element instanceof HTMLElement && this.header.element instanceof HTMLElement) {
                              this.content.style = {
                                   opacity: 1,
                                   height: `${this.element.offsetHeight - this.header.element.offsetHeight}px`
                              }
                         }
                    }, 200)

               }, 10)
          }
     }

}