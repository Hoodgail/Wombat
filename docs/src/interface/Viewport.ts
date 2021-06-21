import Dom from "./Dom";

/**
 * Taskbar dom interface
 */
export default class Viewport extends Dom {

     /**
      * Constructs the dom
      */
     constructor() {
          super("div", { id: "Viewport" });
     }

}