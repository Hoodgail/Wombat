import Dom from "./Dom.js";

import { applications } from "../core/applications/default.js";
import { folders } from "../core/items/default.js";

import Taskbar from "./Taskbar.js";
import Desktop from "./Desktop.js";
import Viewport from "./Viewport.js";

/**
 * Root dom interface
 */
export default class Root extends Dom {

     #applications = applications;
     #folders = folders;

     /**
      * @type {Dom<document.body>}
      */
     body = new Dom(document.body)

     /** 
      * Root taskbar
      * 
      * @type {Taskbar}
      */
     taskbar = new Taskbar();

     /** 
      * Root Viewport
      * Where the desktop will be located
      * 
      * Where applications will be rendererd
      * 
      * @type {Taskbar}
      */
     viewport = new Viewport();

     /**
      * Root desktop
      */
     desktop = new Desktop();

     /**
      * Constructs the dom
      */
     constructor() {
          super("div", { id: "Root" });

          this.desktop.folder.root = this;

          [...applications, ...folders].forEach(app => { app.root = this });
     };

     getApplication(name) {
          return applications
               .filter(e => e.meta.name == name)
               .pop()
     }

     /**
      * Adds the root to the website's body.
      */
     create() {
          this.body.add(this);

          this.viewport.style = { height: "88%" };
          this.taskbar.style = { height: "15%" };

          this.add(
               this.viewport,
               this.taskbar
          );

          this.viewport.add(this.desktop);

          this.taskbar.insert(
               this.getApplication("File Manager")
          );
     }

};