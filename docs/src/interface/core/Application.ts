import DraggableWindow from "./DraggableWindow";
import Item from "./Item";

/**
 * Taskbar dom interface
 */
export default class Application extends Item {

     public taskbar: boolean
     public taskbarDefault: boolean

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

          const notInTaskbar = this.root.taskbar.includes(this);

          if (!notInTaskbar) {
               this.taskbar = true;
               this.root.taskbar.insert(this, {
                    active: true
               });
          } else {
               this.taskbarDefault = true;
               this.root.taskbar.updateConfig(this, {
                    active: true
               });
          }

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

          window.emitter.addEventListener("close-window", window => {
               this.windows.delete(window.id);

               if (this.taskbar) this.root.taskbar.outsert(this)
               if (this.taskbarDefault) this.root.taskbar.updateConfig(this, { active: false });

               this.taskbar = false;
               this.taskbarDefault = false;
          })
     }

}