import DraggableWindow from "./DraggableWindow";
import Item from "./Item";

/**
 * Taskbar dom interface
 */
export default class Application extends Item {

     module = null;

     /**
      * Constructs the dom.
      * 
      * @argument {any} module
      */
     constructor(_module: any = {}) {
          super();

          console.log(_module);

          this.module = _module;

          this.createApplication();
     }

     /**
      * Creates the element.
      * 
      * Adds the icon &
      * Adds the text name.
      */
     createApplication() {

          this.create({
               icon: this.module.base + "/icon.png",
               iconType: 1,
               name: this.module.name,
               type: "application"
          });

     }

     open(...data) {
          console.time("[open] " + this.module.name);
          if (this.module.draggable_window) this.openWindow(...data);
          console.timeEnd("[open] " + this.module.name);

          this.emitter.emit("open")
     }

     openWindow(...data) {
          const Build = this.module;

          const body = new Build();

          const window = new DraggableWindow(this.module.draggable_window);

          window.content.add(
               body
          );

          window.init(this.root);

          body.create(this.root, ...data);

          this.windows.set(window.id, window);

          window.emitter.addEventListener("close-window", window => this.windows.delete(window.id))
     }

}