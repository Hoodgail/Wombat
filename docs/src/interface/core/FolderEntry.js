import Folder from "./Folder.js";
import Item from "./Item.js";

export default class FolderEntry extends Array {

     /**
      * 
      * @param {Folder|Item} item 
      */
     delete(item) {
          const index = this.indexOf(item);

          if (index == -1) return 1;

          delete index[index];

          return 2;
     }

     /**
      * 
      * @param {string} property
      * @param {any} value 
      */
     deleteByProperty(property, value) {
          const index = this.findIndex(item => item[property] === value);

          const item = this[index]

          return this.delete(item);
     }

     /**
      * 
      * @param {string} name 
      */
     deleteByName(name) {
          return this.deleteByProperty("name", name);
     }

     /**
      * 
      * @param {Folder|Item} item 
      */
     add(item) {

          item.parentEntry = this;
          item.parent = this.folder;

          return this.push(item);
     }

}