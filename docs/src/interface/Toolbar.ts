import EventEmitter from "../EventEmitter";
import Dom from "./Dom";

interface ToolbarConfig {
     interval: number
}

export default class Toolbar extends Dom {

     public date?: Date;
     public interval: NodeJS.Timeout;

     //** where time till be displayed */
     time = new Dom("div", { className: "time" });

     emitter = new EventEmitter()

     constructor(config: ToolbarConfig) {
          super("div", { id: "Toolbar" });

          this.interval = setInterval(() => this.update(), config.interval);

          this.add(
               this.time
          )
     }

     update() {
          this.date = new Date();

          const match: RegExpMatchArray | null = this.date.toLocaleTimeString().match(/([0-9]+):([0-9]+):([0-9]+) ([AM|PM]+)/);

          if (match !== null) {
               const [
                    matchString,
                    hour,
                    minute,
                    second,
                    AP
               ] = match;

               this.time.text = `${hour}:${minute} ${AP}`
          }
     }
}