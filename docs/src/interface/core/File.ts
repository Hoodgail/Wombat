import Item from "./Item";

export default class File extends Item {

     constructor(config) {

          super();

          this.create({
               name: config.name,
               icon: "description",
               type: "file",
               iconType: 2
          })

     }

}