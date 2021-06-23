import Item, { Meta } from "./Item";
import FolderEntry from "./FolderEntry";
import Application from "./Application";
import File from "./File";

export interface FolderMeta extends Meta {
     children?: Array<Item | Folder | Application | File>
}

export default class Folder extends Item {
     public folder: any;

     children: FolderEntry = new FolderEntry();

     constructor(config: FolderMeta) {

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

          if (app !== null) app.open(this);
     }

}