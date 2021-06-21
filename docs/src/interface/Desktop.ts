import Dom from "./Dom";

import { applications } from "../core/applications/default";
import { folders } from "../core/items/default";
import Folder from "./core/Folder";
import ContextMenu from "./core/ContextMenu";

/**
 * Taskbar dom interface
 */
export default class Desktop extends Dom {

     folder = new Folder({
          name: "Desktop"
     });

     contextMenu = new ContextMenu(this.element, []);

     /**
      * Constructs the dom
      */
     constructor() {
          super("div", { id: "Desktop" });

          this.update();

          const contextMenu = new ContextMenu(this.element, []);

          contextMenu.emitter.addEventListener("open", e => {
               const items = [];

               const element = e.path.filter(e => e.id == "Item").pop();

               if (element && element.item.context) {
                    items.push(...element.item.context);

                    contextMenu.ignore = false
               } else {
                    contextMenu.ignore = true;
               }

               contextMenu.createItems(items);
          })

          contextMenu.install();
     }

     update() {
          this.clear();

          [...applications, ...folders].forEach(item => {
               this.folder.children.add(item);

               this.add(item);
          });
     }

}