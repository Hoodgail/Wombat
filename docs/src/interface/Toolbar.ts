import EventEmitter from "../EventEmitter.js";
import Dom from "./Dom";

interface ToolbarConfig {
     interval: number
}

export default class Toolbar extends Dom {

     public date: Date;
     public interval: NodeJS.Timeout;

     //** where time till be displayed */
     time = new Dom("div", { className: "time" });

     emitter = new EventEmitter()

     constructor(config: ToolbarConfig) {
          super("div", { id: "Toolbar" });

          this.interval = setInterval(() => this.update(), config.interval)
     }

     update() {

     }
}