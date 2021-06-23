import Item, { Meta } from "./Item";
import { root } from "../../index";

export interface FileMeta extends Meta {
     data: string | ArrayBuffer,
     dataType: "utf8" | "buffer"
}

export default class File extends Item {

     public data: string | ArrayBuffer | undefined;

     constructor(config: FileMeta) {

          super();

          this.create({
               name: config.name,
               icon: "description",
               type: "file",
               iconType: 2
          });

          this.data = config.data || undefined;

     }

     open() {
          const textpad = root.getApplication("Textpad");

          if (textpad !== null) textpad.open(this.data)
     }

}