import EventEmitter from "../EventEmitter.js";
import Dom from "./Dom";

export default class Toolbar extends Dom {

     //** where time till be displayed */
     time = new Dom("div", { className: "time" });

     emitter = new EventEmitter()

     constructor() {
          super("div", { id: "Toolbar" })
     }
}