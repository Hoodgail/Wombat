import Application from "./core/Application";
import File from "./core/File";
import Folder from "./core/Folder";
import Item from "./core/Item";
import Dom from "./Dom";
import Toolbar from "./Toolbar";

export interface TaskbarInsertConfig {
     active: boolean
}

export interface TaskbarMapValue {
     body: Dom,
     icon?: Dom,
     config: TaskbarInsertConfig
}

/**
 * Taskbar dom interface
 */
export default class Taskbar extends Dom {

     items: Dom = new Dom("div", { className: "items" });
     itemsContent: Dom = new Dom("div", { className: "content" });

     toolbar: Toolbar = new Toolbar({ interval: 1000 });

     map: Map<Item | Application | File | Folder, TaskbarMapValue> = new Map();

     /**
      * Constructs the dom
      */
     constructor() {
          super("div", { id: "Taskbar" });

          this.items.add(this.itemsContent);

          this.add(
               this.items,
               this.toolbar
          )
     }

     includes(item: Item | Application | File | Folder): boolean {
          return this.map.has(item)
     }

     outsert(item: Item | Application | File | Folder) {
          if (!this.map.has(item)) return;

          const { body, config } = this.map.get(item) || {};

          if (body && config && config.active) {
               body.attribute("active", "false");
               body.style = { opacity: 0 };
               setTimeout(() => body.remove(), 100)
          } else if (body) {
               body.remove();
          }

          this.map.delete(item);
     }

     applyConfig(config: TaskbarInsertConfig, body: Dom) {
          body.attribute("active", config && config.active == true ? "true" : "false")
     }

     updateConfig(item: Item | Application | File | Folder, config?: TaskbarInsertConfig) {
          if (!this.map.has(item)) return;

          const map = this.map.get(item);

          if (map && config !== undefined) this.applyConfig(config, map.body);

          if (map && map !== undefined) {

               map.config = config || <TaskbarInsertConfig>{};
          }
     }

     /**
      * Adds an application to the taskbar
      */
     insert(item: Item | Application | File | Folder, config: TaskbarInsertConfig = <TaskbarInsertConfig>{}) {

          if (this.map.has(item)) return;

          const body = new Dom("div", { className: "item" });
          const screenshot = new Dom("div", { className: "screenshot" });

          body.style = { opacity: 0 };

          setTimeout(() => this.applyConfig(config || <TaskbarInsertConfig>{}, body), 100)

          body.event("dblclick", function () {
               item.open()
          });

          body.event("mouseover", async () => {

               const screenshots = await Promise
                    .all([...item.windows].map(([e, a]) => a.screenshot()));

               screenshot.clear();

               screenshot.add(...screenshots);

               if (body.element instanceof HTMLElement) {
                    const rect = body.element.getBoundingClientRect();

                    let length = screenshots.length;

                    screenshot.style = <any>{
                         top: `${rect.top - 150}px`,
                         right: `${rect.right + 520}px`,
                         transform: `translateX(${length + (length % 2 == 0 ? 1 : 0)}0%)`,
                         opacity: 1
                    };
               }

          });

          body.event("mouseleave", async () => {

               screenshot.style = <any>{
                    opacity: 0
               }

          });

          let proto: TaskbarMapValue = { body, config }

          if (item.meta.icon !== undefined && item.meta.iconType !== undefined) {
               proto.icon = item.createIcon(item.meta.icon, item.meta.iconType);
               body.add(proto.icon)
          }

          item.root.add(screenshot)

          this.itemsContent.add(
               body
          );

          setTimeout(() => body.style = { opacity: 1 }, 50)

          return this.map.set(item, proto)
     }

}