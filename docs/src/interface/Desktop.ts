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
     })

     /**
      * Constructs the dom
      */
     constructor() {
          super("div", { id: "Desktop" });

          this.update();

          const contextMenu = new ContextMenu(this.element, []);

          contextMenu.emitter.addEventListener("open", e => {
               const items = [];

               const item = e.path.filter(e => e.id == "Item").pop();

               if (item) {
                    items.push(
                         { text: 'Open', onclick: () => item.item.open() },
                         { text: 'Delete', onclick: () => item.item.delete() },
                    );

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