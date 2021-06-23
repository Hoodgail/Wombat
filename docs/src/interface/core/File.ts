import Item, { Meta } from "./Item";

export interface FileMeta extends Meta {
     data: string | ArrayBuffer,
     dataType: "utf8" | "buffer"
}

export default class File extends Item {

     constructor(config: FileMeta) {

          super();

          this.create({
               name: config.name,
               icon: "description",
               type: "file",
               iconType: 2
          })

     }

}