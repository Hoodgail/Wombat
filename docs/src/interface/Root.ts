import Dom from "./Dom";

import { applications } from "../core/applications/default";

import Taskbar from "./Taskbar";
import Desktop from "./Desktop";
import Viewport from "./Viewport";
import Application from "./core/Application";
import { folders } from "../core/items/default";

import Folder from "./core/Folder";
import Start from "./core/Start";

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

     start: Start = new Start();

     /**
      * Constructs the dom
      */
     constructor() {
          super("div", { id: "Root" });
     };

     getApplication(name: string): Application | null { // what did console show i cant see anything
          return applications
               .filter(e => e.meta.name == name)
               .pop() || null
     }

     getFolder(name: string): Folder | null { // what did console show i cant see anything
          return [this.desktop.folder, ...folders]
               .filter(e => e.meta.name == name)
               .pop() || null
     }

     getItemFromPath(path: string) {
          let propComps = path.split("/root/")[1].split('/');
          let currentObj = this.getFolder(propComps[0]) || null;
          for (const p of propComps) {
               if (currentObj && p !== propComps[0]) {
                    currentObj = currentObj.children.findByProperty("name", p);
               }
          }
          return currentObj;

     }

     /**
      * Adds the root to the website's body.
      */
     create() {
          this.body.add(this);

          this.add(
               this.viewport,
               this.taskbar,
               this.start
          );

          this.viewport.add(this.desktop);

          this.taskbar.add(this.start.launcherBody);

          const fileManager = this.getApplication("File Manager");
          if (fileManager !== null) this.taskbar.insert(fileManager);

          const textpad = this.getApplication("Textpad");
          if (textpad !== null) this.taskbar.insert(textpad);

     }

     resize() {
          this.taskbar.style = { height: "-webkit-fill-available" }

          this.viewport.style = { height: "-webkit-fill-available" }
     }

};