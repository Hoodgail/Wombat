import Dom from "../Dom";

const domtoimage: any = null; // remove this
// import domtoimage from 'dom-to-image'; // u need to install this
import EventEmitter from "../../EventEmitter";

/**
 * Taskbar dom interface
 */
export default class DraggableWindow extends Dom {

     public config: any;

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

     randomInt(min, max) {
          return Math.floor(Math.random() * (max - min)) + min;
     }

     init(root) {
          // make position sensitive to size and document's width

          const parentRect = root.viewport.element.getBoundingClientRect();

          let left = Math.random() * (parentRect.width - this.config.width);
          let top = Math.random() * (parentRect.height - this.config.height)

          this.element.style.top = top + "px";
          this.element.style.left = left + "px";

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
                    this.content.style = {
                         opacity: 1,
                         height: `${this.element.offsetHeight - this.header.element.offsetHeight}px`
                    }
               }, 200)
          }, 10)
     }

}