import Dom from "../Dom.js";
import EventEmitter from "../../EventEmitter.js";
import Vector2 from "../../Vector2.js";
import ExternalError from "./InternalError.js";
import ContextMenu from "./ContextMenu.js";


/**
 * Item constructor
 * Filesystem foler or file wrapper
 */
export default class Item extends Dom {

     static nameLength = 255;

     static nameReserved = [
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

     static nameAvoid = [
          "PRN", "AUX", "NUL", "COM1",
          "COM2", "COM3", "COM4", "COM5",
          "COM6", "COM7", "COM8", "COM9",
          "LPT1", "LPT2", "LPT3", "LPT4",
          "LPT5", "LPT6", "LPT7", "LPT8",
          "LPT9"
     ];

     emitter = new EventEmitter();
     position = new Vector2();

     /** @type {Map<number, DraggableWindow>} */
     windows = new Map();

     /** @type {Map<number, Dom>} */
     clones = new Map();

     icon = new Dom("div", { className: "icon" });
     name = new Dom("div", { className: "name" });

     /** @type {Root} */
     root = null;

     meta = Object.create(null);

     context = [
          { text: 'Open', value: 'chrome-dark', onclick: () => { } },
          { text: 'Delete', value: 'chrome-bright', onclick: () => { } }
     ]

     constructor() {
          super("div", { id: "Item" });

          this.element.item = this;

          this.createEvents({
               name: this.name,
               icon: this.icon,
               open: () => this.open(),
               update() { }
          });

     }

     createEvents(config) {
          config.icon.event("dblclick", () => config.open());

          config.name.event("dblclick", () => {
               config.name.element.setAttribute("contenteditable", true);
               config.name.element.focus();
               document.execCommand('selectAll', false, null);

               config.update();
          });

          config.name.event("blur", () => {
               config.name.element.setAttribute("contenteditable", false);

               try {
                    const name = this.formatFileName(config.name.text);

                    this.rename(name)

                    config.name.text = name;

                    this.emitter.emit("rename", name);
               } catch (e) {
                    config.name.text = config.meta.name;
               }

               config.update();
          })
     }

     formatFileName(name) {
          if (name.endsWith(" ") || name.endsWith(".")) throw new ExternalError('Do not end a file or directory name with a space or a period. Although the underlying file system may support such names, the Windows shell and user interface does not. However, it is acceptable to specify a period as the first character of a name. For example, ".temp".');

          for (let reserved of Item.nameReserved) {
               if (name.includes(reserved)) throw new ExternalError(`printable ASCII character "${reserved}" out of characters '${Item.nameReserved.join(", ")}' are forbidden.`);
          }

          if (Item.nameAvoid.includes(name)) throw new ExternalError(`${Item.nameAvoid.join(", ")}. Also avoid these names followed immediately by an extension; for example, ${Item.nameAvoid.random()}.txt is not recommended.`)
          if (name.length > Item.nameLength) throw new ExternalError(`The API imposes a maximum filename length such that a filename, including the file path to get to the file, can't exceed ${Item.nameLength} characters.`)

          return name.replace(/\n/gm, "").trim();
     }

     rename(value) {
          this.meta.name = value;
     }

     open() { }

     createClone() {
          const clone = this.clone(true);

          clone.cloneId = Number(String(Math.random()).split(".").pop());

          clone.element.setAttribute("clone", true);

          this.clones.set(clone.cloneId, clone);

          return clone;
     }

     /**
      * 
      * @param {object} config 
      * @param {string} config.name
      * @param {string} config.base
      * @param {string} config.icon
      * @param {number} config.iconType
      */
     create(config) {

          Object.assign(this.meta, config);

          this.element.setAttribute("item-type", config.type || "null");

          this.clear();

          this.name.text = config.name;

          this.icon.add(
               this.createIcon(config.icon, config.iconType || 1)
          )

          this.add(
               this.icon,
               this.name
          );
     }

     createIcon(icon, type) {
          switch (type) {
               case 1:
                    return new Dom("img", { src: icon })

               case 2:
                    return new Dom("span", { className: "material-icons", innerText: icon })

          }
     }

}