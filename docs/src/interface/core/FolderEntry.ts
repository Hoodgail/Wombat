import Application from "./Application";
import File from "./File";
import Folder from "./Folder";
import Item from "./Item";

export default class FolderEntry extends Array {
     public folder?: Folder;
     public parent?: Folder;

     /**
      * 
      * @param {Folder|Item} item 
      */
     delete(item: Folder | Item) {
          const index = this.indexOf(item);

          if (index == -1) return 1;

          delete this[index];

          return 2;
     }

     /**
      * 
      * @param {string} property
      * @param {any} value 
      */
     deleteByProperty(property: string, value: any) {
          const index = this.findIndex(item => item[property] === value);

          const item = this[index]

          return this.delete(item);
     }

     /**
      * 
      * @param {string} name 
      */
     deleteByName(name: string) {
          return this.deleteByProperty("name", name);
     }

     /**
      * 
      * @param {Item} item 
      */
     add(item: Item) {

          if (this.includes(item)) return;

          item.parentEntry = this;

          if (this.folder !== undefined) item.parent = this.folder;

          return this.push(item);
     }

}