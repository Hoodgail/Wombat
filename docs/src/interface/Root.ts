import Dom from "./Dom";

import { applications } from "../core/applications/default";
import { folders } from "../core/items/default";

import Taskbar from "./Taskbar";
import Desktop from "./Desktop";
import Viewport from "./Viewport";

/**
 * Root dom interface
 */
export default class Root extends Dom {

     /**
      * @type {Dom<document.body>}
      */
     body: Dom = new Dom(document.body)

     /** 
      * Root taskbar
      * 
      * @type {Taskbar}
      */
     taskbar: Taskbar = new Taskbar();

     /**
      * Root toolbar
      * will be displayed after the task bar
      * 
      * time, notifs etc
      * 
      * @type {Toolbar}
      */
     toolbar: any = null;

     /** 
      * Root Viewport
      * Where the desktop will be located
      * 
      * Where applications will be rendererd
      * 
      * @type {Taskbar}
      */
     viewport: Viewport = new Viewport();

     /**
      * Root desktop
      */
     desktop: Desktop = new Desktop();

     /**
      * Constructs the dom
      */
     constructor() {
          super("div", { id: "Root" });

          this.desktop.folder.root = this;

          [...applications, ...folders].forEach(app => { app.root = this });
     };

     getApplication(name: string) { // what did console show i cant see anything
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

          this.viewport.add(this.desktop)

          this.taskbar.insert(
               this.getApplication("FileManager")
          );
     }

};