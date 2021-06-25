import Dom from "../Dom";
import EventEmitter from "../../EventEmitter";
import ExternalError from "./InternalError";
import DraggableWindow from "./DraggableWindow";
import FolderEntry from "./FolderEntry";
import Folder from "./Folder";
import Root from "../Root";

export interface ItemEvent {
     name: Dom,
     icon: Dom,
     open: Function,
     update: Function
};

export interface Meta {
     name: string,
     type?: string,
     icon?: string,
     iconType?: 1 | 2
}

/**
 * Item constructor
 * Filesystem foler or file wrapper
 */
export default class Item extends Dom {

     public parentEntry!: FolderEntry;
     public parent!: Folder;
     public root!: Root;

     static nameLength: number = 255;

     static nameReserved: Array<string> = [
          "<",
          ">",
          ":",
          "\"",
          "/",
          "\\",
          "|",
          "?",
          "*"
     ];

     static nameAvoid: Array<string> = [
          "PRN", "AUX", "NUL", "COM1",
          "COM2", "COM3", "COM4", "COM5",
          "COM6", "COM7", "COM8", "COM9",
          "LPT1", "LPT2", "LPT3", "LPT4",
          "LPT5", "LPT6", "LPT7", "LPT8",
          "LPT9"
     ];

     emitter: EventEmitter = new EventEmitter();

     /** @type {Map<number, DraggableWindow>} */
     windows: Map<number, DraggableWindow> = new Map();

     /** @type {Map<number, Dom>} */
     clones: Map<number, Dom> = new Map();

     icon: Dom = new Dom("div", { className: "icon" });
     name: Dom = new Dom("div", { className: "name" });

     meta: Meta = Object.assign(Object.create(null), {
          name: "unknown",
          type: "file",
          icon: "app_registration",
          iconType: 2
     });

     context: Array<any> = [
          { text: 'Open', value: 'chrome-dark', onclick: () => { } },
          { text: 'Delete', value: 'chrome-bright', onclick: () => { } }
     ]

     constructor() {
          super("div", { id: "Item" });

          // @ts-ignore
          this.element.item = this;

          this.createEvents({
               name: this.name,
               icon: this.icon,
               open: () => this.open(),
               update() { }
          });

     }

     createEvents(config: ItemEvent) {
          config.icon.event("dblclick", () => config.open());

          config.name.event("dblclick", () => {

               if (config.name.element !== null && config.name.element instanceof HTMLElement) {
                    config.name.element.setAttribute("contenteditable", "true");
                    config.name.element.focus();
                    document.execCommand('selectAll', false, undefined);
               }

               config.update();
          });

          config.name.event("blur", () => {
               if (config.name.element instanceof HTMLElement) {
                    config.name.element.setAttribute("contenteditable", "false");

                    try {
                         const name = this.formatFileName(config.name.text);

                         this.rename(name)

                         config.name.text = name;

                         this.emitter.emit("rename", name);
                    } catch (e) {
                         config.name.text = this.meta.name;
                    }
               }

               config.update();
          })
     }

     formatFileName(name: string) {
          if (name.endsWith(" ") || name.endsWith(".")) throw new ExternalError('Do not end a file or directory name with a space or a period. Although the underlying file system may support such names, the Windows shell and user interface does not. However, it is acceptable to specify a period as the first character of a name. For example, ".temp".');

          for (let reserved of Item.nameReserved) {
               if (name.includes(reserved)) throw new ExternalError(`printable ASCII character "${reserved}" out of characters '${Item.nameReserved.join(", ")}' are forbidden.`);
          }

          // @ts-ignore
          if (Item.nameAvoid.includes(name)) throw new ExternalError(`${Item.nameAvoid.join(", ")}. Also avoid these names followed immediately by an extension; for example, ${Item.nameAvoid.random()}.txt is not recommended.`)
          if (name.length > Item.nameLength) throw new ExternalError(`The API imposes a maximum filename length such that a filename, including the file path to get to the file, can't exceed ${Item.nameLength} characters.`)

          return name.replace(/\n/gm, "").trim();
     }

     rename(value: string) {
          this.meta.name = value;
     }

     open() { }

     createClone(): Dom {
          const clone = this.clone(true);

          // @ts-ignore
          clone.cloneId = Number(String(Math.random()).split(".").pop());

          // @ts-ignore
          clone.element.setAttribute("clone", true);

          // @ts-ignore
          this.clones.set(clone.cloneId, clone);

          // @ts-ignore
          clone.element.item = this;

          // @ts-ignore
          return clone;
     }

     /**
      * 
      * @param {Meta} config 
      * @param {string} config.name
      * @param {string} config.base
      * @param {string} config.icon
      * @param {number} config.iconType
      */
     create(config: Meta) {

          Object.assign(this.meta, config);

          if (this.element instanceof HTMLElement) {
               this.element.setAttribute("item-type", config.type || "null");
          }

          this.clear();

          this.name.text = config.name;

          if (config.icon !== undefined) {
               this.icon.add(
                    this.createIcon(config.icon, config.iconType || 1)
               )
          }

          this.add(
               this.icon,
               this.name
          );
     }

     createIcon(icon: string, type: number): Dom {
          switch (type) {
               case 1:
                    return new Dom("img", { src: icon })

               case 2:
               default:
                    return new Dom("span", { className: "material-icons", innerText: icon })

          }
     }

     getParent(item: Item): Array<Folder> {
          return item.parent ? [item.parent, ...this.getParent(item.parent)].filter(e => e !== undefined) : []
     }

     get path(): string {
          return "/root/" + [...this.getParent(this), this]
               .map(e => e.meta.name)
               //.reverse()
               .join("/")
     }

}