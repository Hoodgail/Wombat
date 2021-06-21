import Application from "./core/Application.js";
import Item from "./core/Item.js";
import Dom from "./Dom.js";

/**
 * Taskbar dom interface
 */
export default class Taskbar extends Dom {

     items = new Dom("div", { className: "items" });

     /**
      * @type {Map<Application, Object>}
      */
     map = new Map();

     /**
      * Constructs the dom
      */
     constructor() {
          super("div", { id: "Taskbar" });

          this.add(
               this.items
          )
     }

     /**
      * Adds an application to the taskbar
      * @param {Item} item 
      */
     insert(item) {

          if (this.map.has(item)) return;

          const body = new Dom("div", { className: "item" });
          const screenshot = new Dom("div", { className: "screenshot" });

          const icon = item.createIcon(item.meta.icon, item.meta.iconType)

          body.event("dblclick", function () {
               item.open()
          });

          body.event("mouseover", async () => {

               const screenshots = await Promise
                    .all([...item.windows].map(([e, a]) => a.screenshot()));

               screenshot.clear();

               screenshot.add(...screenshots);

               const rect = body.element.getBoundingClientRect();

               let length = screenshots.length;

               screenshot.style = {
                    top: `${rect.top - 150}px`,
                    right: `${rect.right + 520}px`,
                    transform: `translateX(${length + (length % 2 == 0 ? 1 : 0)}0%)`,
                    opacity: 1
               };

          });

          body.event("mouseleave", async () => {

               screenshot.style = {
                    opacity: 0
               }

          });

          item.root.add(screenshot)

          this.items.add(
               body.add(
                    icon
               )
          );

          return this.map.set(item, { body, icon })
     }

}