import Item from "./Item";
import FolderEntry from "./FolderEntry";

export default class Folder extends Item {
     public folder: any;

     children = new FolderEntry();

     constructor(config) {

          super();

          this.children.folder = this;

          this.create({
               name: config.name,
               type: "folder",
               icon: "folder",
               iconType: 2
          });

          if (config.children) config.children.forEach(item => this.children.add(item));



     }

     open() {
          const app = this.root.getApplication("File Manager");

          app.open(this);
     }

}