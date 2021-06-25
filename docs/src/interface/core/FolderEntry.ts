import Folder from "./Folder";
import Item from "./Item";

export default class FolderEntry extends Array {
     public folder?: Folder;
     public parent?: Folder;

     /**
      * 
      * @param {Item} item 
      */
     delete(item: Item) {
          const index = this.indexOf(item);

          if (index == -1) return 1;

          delete this[index];

          return 2;
     }

     /**
      * 
      * @param {string} property
      * @param {unknown} value 
      */
     deleteByProperty(property: string, value: unknown) {
          return this.delete(this.findByProperty(property, value));
     }

     /**
      * 
      * @param {string} property
      * @param {unknown} value 
      */
     findByProperty(property: string, value: any) {
          const index = this.findIndex((item) => item.meta[property] === value);

          const item = this[index]

          return item;
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